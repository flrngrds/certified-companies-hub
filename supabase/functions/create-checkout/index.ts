
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Parse request body
    const { priceId } = await req.json();
    
    // Get authentication token and user information
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('User not authenticated');
    }
    
    const email = user.email;
    if (!email) {
      throw new Error('User email not found');
    }

    console.log(`Creating checkout for user: ${user.id}, email: ${email}`);

    // Initialize Stripe with secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if customer already exists in Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer_id = undefined;
    
    if (customers.data.length > 0) {
      customer_id = customers.data[0].id;
      console.log(`Found existing Stripe customer: ${customer_id}`);
      
      // Check if already subscribed to this price
      const subscriptions = await stripe.subscriptions.list({
        customer: customer_id,
        status: 'active',
        price: priceId,
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        throw new Error("You are already subscribed to this plan");
      }
    } else {
      console.log('No existing Stripe customer found, will create a new one');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      customer_email: customer_id ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${req.headers.get('origin')}/profile`,
      cancel_url: `${req.headers.get('origin')}/profile`,
      // Store the user ID in the metadata so we can link it later
      metadata: {
        user_id: user.id
      }
    });

    console.log(`Checkout session created: ${session.id}`);
    
    // Record the checkout attempt in Supabase
    const { error: recordError } = await supabaseClient
      .from('stripe_customers')
      .upsert({
        id: user.id,
        updated_at: new Date().toISOString()
      });
      
    if (recordError) {
      console.warn('Error recording checkout attempt:', recordError);
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
