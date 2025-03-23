
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  console.log("Webhook received:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the signature from request headers
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing Stripe signature:', Object.fromEntries(req.headers.entries()));
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the raw request body content
    const rawBody = await req.text();
    console.log("Webhook payload received (partial):", rawBody.substring(0, 100) + "...");

    // Verify webhook signature for security
    let event;
    try {
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET not configured');
      }
      
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Stripe event received: ${event.type}`);

    // Process different types of Stripe events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log("Checkout session completed:", session.id);
        
        // Extract user ID from metadata if available
        const userId = session.metadata?.user_id;
        
        if (userId) {
          console.log(`User ID found in metadata: ${userId}`);
          await handleCheckoutWithUserId(supabaseClient, stripe, session, userId);
        } else {
          console.log("No user ID in metadata, attempting to match by email");
          await handleCheckoutCompleted(supabaseClient, stripe, session);
        }
        break;
      }
        
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`Subscription ${event.type === 'customer.subscription.deleted' ? 'cancelled' : 'updated'}:`, subscription.id);
        
        await handleSubscriptionUpdate(supabaseClient, subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Function to handle checkout events with user ID already known
async function handleCheckoutWithUserId(supabaseClient, stripe, session, userId) {
  console.log(`Processing checkout for known user ID: ${userId}`);
  
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const priceId = subscription.items.data[0].price.id;
    
    // Update subscription information for the user
    const { error: updateError } = await supabaseClient
      .from('stripe_customers')
      .upsert({
        id: userId,
        stripe_customer_id: session.customer,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        price_id: priceId,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      });
      
    if (updateError) {
      console.error('Error updating subscription information:', updateError);
    } else {
      console.log('Subscription successfully linked to user:', userId);
    }
  } else {
    console.log('No subscription found in checkout session');
  }
}

// Function to handle checkout.session.completed events
async function handleCheckoutCompleted(supabaseClient, stripe, session) {
  // Get the Stripe customer
  const customerId = session.customer;
  console.log("Processing checkout for Stripe customer:", customerId);
  
  // Retrieve subscription if available
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const priceId = subscription.items.data[0].price.id;
    console.log("Subscription found with price_id:", priceId);
    
    // Find user associated with this Stripe customer
    const { data: customerData, error: customerError } = await supabaseClient
      .from('stripe_customers')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();
      
    if (customerError) {
      console.error('Error retrieving customer data:', customerError);
      return;
    }
    
    if (customerData) {
      console.log("Found user for Stripe customer:", customerData.id);
      
      // Update subscription information
      const { error: updateError } = await supabaseClient
        .from('stripe_customers')
        .update({
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          price_id: priceId,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerData.id);
        
      if (updateError) {
        console.error('Error updating subscription:', updateError);
      } else {
        console.log('Subscription updated successfully for user:', customerData.id);
      }
    } else {
      console.log('No user found for Stripe customer ID:', customerId);
      
      // Try to match by email
      try {
        const stripeCustomer = await stripe.customers.retrieve(customerId);
        if (stripeCustomer && stripeCustomer.email) {
          console.log("Found email for Stripe customer:", stripeCustomer.email);
          
          // Find user by email
          const { data: authUsers } = await supabaseClient
            .auth
            .admin
            .listUsers();
          
          const matchingUser = authUsers.users.find(u => u.email === stripeCustomer.email);
          
          if (matchingUser) {
            console.log("Found Supabase user by email:", matchingUser.id);
            
            // Create or update Stripe customer information
            const { error: upsertError } = await supabaseClient
              .from('stripe_customers')
              .upsert({
                id: matchingUser.id,
                stripe_customer_id: customerId,
                subscription_id: subscription.id,
                subscription_status: subscription.status,
                price_id: priceId,
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date().toISOString()
              });
              
            if (upsertError) {
              console.error('Error recording customer data:', upsertError);
            } else {
              console.log('Successfully linked Stripe customer to user:', matchingUser.id);
            }
          } else {
            console.log("No user found with email:", stripeCustomer.email);
          }
        }
      } catch (stripeError) {
        console.error("Error retrieving Stripe customer:", stripeError);
      }
    }
  } else {
    console.log("No subscription found in checkout session");
  }
}

// Function to handle subscription updates
async function handleSubscriptionUpdate(supabaseClient, subscription) {
  // Get the Stripe customer ID
  const customerId = subscription.customer;
  console.log("Updating subscription for customer:", customerId);
  
  // Find user associated with this Stripe customer
  const { data: customerData, error: customerError } = await supabaseClient
    .from('stripe_customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
    
  if (customerError) {
    console.error('Error retrieving customer data:', customerError);
    return;
  }
  
  if (customerData) {
    console.log("Found user for Stripe customer:", customerData.id);
    
    // Get price ID from subscription
    const priceId = subscription.items.data[0].price.id;
    
    // Update subscription information
    const { error: updateError } = await supabaseClient
      .from('stripe_customers')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        price_id: priceId,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerData.id);
      
    if (updateError) {
      console.error('Error updating subscription:', updateError);
    } else {
      console.log('Subscription updated successfully for user:', customerData.id);
    }
  } else {
    console.error('No user found for Stripe customer:', customerId);
  }
}
