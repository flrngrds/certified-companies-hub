
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("check-subscription function called");
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("No Authorization header");
      return new Response(
        JSON.stringify({ plan: 'Free', error: 'Not authenticated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user?.id) {
      console.log("No user found with token");
      return new Response(
        JSON.stringify({ plan: 'Free', error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking subscription for user: ${user.email}`);

    // Try to find subscription in our database first
    const { data: customerData, error: customerError } = await supabaseClient
      .from('stripe_customers')
      .select('subscription_status, price_id, stripe_customer_id')
      .eq('id', user.id)
      .eq('subscription_status', 'active')
      .maybeSingle();

    if (customerError) {
      console.error("Error fetching customer data from database:", customerError);
    } else if (customerData) {
      console.log("Found active subscription in database:", customerData);
      
      let plan = 'Free';
      switch (customerData.price_id) {
        case 'price_1QGMpIG4TGR1Qn6rUc16QbuT':
          plan = 'Basic';
          break;
        case 'price_1QGMsMG4TGR1Qn6retfbREsl':
          plan = 'Premium';
          break;
        case 'price_1QGMsvG4TGR1Qn6rghOqEU8H':
          plan = 'Enterprise';
          break;
      }
      
      return new Response(
        JSON.stringify({ 
          plan,
          subscriptionStatus: customerData.subscription_status,
          source: 'database'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If not found in database, check directly with Stripe
    console.log("No active subscription found in database, checking with Stripe...");
    
    // First try to get customer by stripe_customer_id if available
    if (customerData?.stripe_customer_id) {
      console.log("Checking subscription for Stripe customer:", customerData.stripe_customer_id);
      
      const subscriptions = await stripe.subscriptions.list({
        customer: customerData.stripe_customer_id,
        status: 'active',
        limit: 1
      });
      
      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        const priceId = subscription.items.data[0].price.id;
        
        let plan = 'Free';
        switch (priceId) {
          case 'price_1QGMpIG4TGR1Qn6rUc16QbuT':
            plan = 'Basic';
            break;
          case 'price_1QGMsMG4TGR1Qn6retfbREsl':
            plan = 'Premium';
            break;
          case 'price_1QGMsvG4TGR1Qn6rghOqEU8H':
            plan = 'Enterprise';
            break;
        }
        
        // Update our database with the current status
        await supabaseClient
          .from('stripe_customers')
          .update({
            subscription_status: 'active',
            price_id: priceId,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        return new Response(
          JSON.stringify({ 
            plan,
            subscriptionStatus: 'active',
            source: 'stripe'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Try to find customer by email
    console.log("Looking up Stripe customer by email:", user.email);
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    if (customers.data.length === 0) {
      console.log("No Stripe customer found with email:", user.email);
      return new Response(
        JSON.stringify({ plan: 'Free', source: 'stripe-no-customer' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripeCustomerId = customers.data[0].id;
    console.log("Found Stripe customer:", stripeCustomerId);

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 10 // Get all active subscriptions to find the right one
    });

    console.log(`Found ${subscriptions.data.length} active subscriptions for customer`);

    if (subscriptions.data.length === 0) {
      // Update our database to clear any stale subscription data
      await supabaseClient
        .from('stripe_customers')
        .update({
          subscription_status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      return new Response(
        JSON.stringify({ plan: 'Free', source: 'stripe-no-subscription' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the most recent subscription
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    console.log(`Active subscription found with price ID: ${priceId}`);

    let plan = 'Free';
    switch (priceId) {
      case 'price_1QGMpIG4TGR1Qn6rUc16QbuT':
        plan = 'Basic';
        break;
      case 'price_1QGMsMG4TGR1Qn6retfbREsl':
        plan = 'Premium';
        break;
      case 'price_1QGMsvG4TGR1Qn6rghOqEU8H':
        plan = 'Enterprise';
        break;
    }

    // Update our database with the current status
    await supabaseClient
      .from('stripe_customers')
      .upsert({
        id: user.id,
        stripe_customer_id: stripeCustomerId,
        subscription_id: subscription.id,
        subscription_status: 'active',
        price_id: priceId,
        updated_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        plan, 
        subscriptionStatus: 'active',
        source: 'stripe-updated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response(
      JSON.stringify({ plan: 'Free', error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 even on error to avoid breaking the UI
      }
    );
  }
});
