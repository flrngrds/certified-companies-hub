
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Hello from check-subscription function!");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authentication token from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    // Use the token from the Authorization header to authenticate with Supabase
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking subscription for user: ${user.email}`);

    // First, check if there is an active subscription in our database
    const { data: localSubscription, error: dbError } = await supabase
      .from('stripe_customers')
      .select('subscription_status, price_id, current_period_end')
      .eq('id', user.id)
      .eq('subscription_status', 'active')
      .maybeSingle();

    if (dbError) {
      console.error('Error checking local subscription:', dbError);
      // Continue to check with Stripe directly
    } else if (localSubscription && localSubscription.subscription_status === 'active' && localSubscription.price_id) {
      console.log('Found active subscription in database:', localSubscription);
      
      // Check if subscription has expired based on current_period_end
      if (localSubscription.current_period_end) {
        const endDate = new Date(localSubscription.current_period_end);
        const now = new Date();
        
        if (endDate < now) {
          console.log('Subscription period has ended, but status is still active. Returning Free plan.');
          return new Response(
            JSON.stringify({ 
              plan: 'Free',
              message: 'Subscription expired' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`Subscription end date: ${endDate.toISOString()}`);
      }
      
      // Map price_id to plan name
      let plan = 'Free';
      switch (localSubscription.price_id) {
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
          message: 'Active subscription found in database',
          subscriptionEndDate: localSubscription.current_period_end 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no active subscription is found in our database or it might be expired, check with Stripe directly
    console.log('No active subscription found in database, checking with Stripe API...');

    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Get the Stripe customer for this user
    const { data: stripeCustomer, error: customerError } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    if (customerError) {
      console.error('Error retrieving Stripe customer ID:', customerError);
      return new Response(
        JSON.stringify({ plan: 'Free', message: 'Error retrieving customer data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!stripeCustomer?.stripe_customer_id) {
      console.log('No Stripe customer ID found for user');
      return new Response(
        JSON.stringify({ plan: 'Free', message: 'No Stripe customer found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking Stripe subscriptions for customer: ${stripeCustomer.stripe_customer_id}`);

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomer.stripe_customer_id,
      status: 'active',
      expand: ['data.items.data.price']
    });

    if (subscriptions.data.length === 0) {
      console.log('No active Stripe subscriptions found');
      return new Response(
        JSON.stringify({ plan: 'Free', message: 'No active subscriptions' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the most recent subscription
    const latestSubscription = subscriptions.data[0];
    const priceId = latestSubscription.items.data[0].price.id;
    
    // Get the end date of the subscription period
    const endDate = latestSubscription.current_period_end 
      ? new Date(latestSubscription.current_period_end * 1000).toISOString() 
      : null;
      
    console.log(`Active subscription found with price ID: ${priceId}`);
    console.log(`Subscription end date: ${endDate}`);
    
    // Map price ID to plan name
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

    // Update our database with the latest subscription info
    const { error: updateError } = await supabase
      .from('stripe_customers')
      .update({
        subscription_id: latestSubscription.id,
        subscription_status: latestSubscription.status,
        price_id: priceId,
        cancel_at_period_end: latestSubscription.cancel_at_period_end,
        current_period_end: endDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating subscription in database:', updateError);
    } else {
      console.log('Successfully updated subscription in database');
    }

    return new Response(
      JSON.stringify({ 
        plan, 
        message: 'Active subscription found in Stripe',
        subscriptionEndDate: endDate
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message, plan: 'Free' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
