
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
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header', plan: 'Free' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body to get additional data
    let userId = null;
    let userEmail = null;
    
    try {
      const requestData = await req.json();
      userId = requestData.userId;
      userEmail = requestData.userEmail;
      console.log(`Additional data from request: userId=${userId}, userEmail=${userEmail}`);
    } catch (e) {
      console.log("No additional data in request body or parsing error:", e);
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
        JSON.stringify({ error: 'Authentication failed', details: authError, plan: 'Free' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If userId wasn't provided in the request, use the authenticated user's ID
    if (!userId) {
      userId = user.id;
    }
    
    // If userEmail wasn't provided in the request, use the authenticated user's email
    if (!userEmail) {
      userEmail = user.email;
    }

    console.log(`Checking subscription for user: ${userEmail} with ID: ${userId}`);

    // First, check if there is an active subscription in our database
    const { data: localSubscription, error: dbError } = await supabase
      .from('stripe_customers')
      .select('subscription_status, price_id, current_period_end, stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();

    console.log('Database query result:', { 
      data: localSubscription, 
      error: dbError,
      userId: userId
    });

    if (dbError) {
      console.error('Error checking local subscription:', dbError);
      // Continue to check with Stripe directly
    } else if (localSubscription) {
      console.log('Found subscription in database:', localSubscription);
      
      // Even if it's not marked as active, let's inspect it
      console.log(`Subscription status: ${localSubscription.subscription_status}`);
      console.log(`Price ID: ${localSubscription.price_id}`);
      console.log(`Stripe customer ID: ${localSubscription.stripe_customer_id}`);

      // If it's active and has a price_id, we can return the plan
      if (localSubscription.subscription_status === 'active' && localSubscription.price_id) {
        console.log('Active subscription found in database with valid price_id');
        
        // Check if subscription has expired based on current_period_end
        if (localSubscription.current_period_end) {
          const endDate = new Date(localSubscription.current_period_end);
          const now = new Date();
          
          if (endDate < now) {
            console.log('Subscription period has ended, but status is still active. Continuing to check with Stripe.');
            // Continue to Stripe check rather than immediately returning Free
          } else {
            console.log(`Subscription end date: ${endDate.toISOString()} is valid (future date)`);
            
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
            
            console.log(`Returning plan: ${plan} based on database record`);
            return new Response(
              JSON.stringify({ 
                plan, 
                message: 'Active subscription found in database',
                subscriptionEndDate: localSubscription.current_period_end,
                stripeCustomerId: localSubscription.stripe_customer_id
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } else {
          console.log('No current_period_end found in active subscription, continuing to check with Stripe');
        }
      }
    }

    // If no active subscription is found in our database or it might be expired, check with Stripe directly
    console.log('Checking with Stripe API...');

    // Initialize Stripe with the secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // First, try to find a Stripe customer by email if we have one
    let stripeCustomerId = null;
    
    if (userEmail) {
      console.log(`Looking for Stripe customer with email: ${userEmail}`);
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
        console.log(`Found Stripe customer by email: ${stripeCustomerId}`);
      }
    }
    
    // If we didn't find a customer by email, try the database lookup
    if (!stripeCustomerId) {
      // Get the Stripe customer for this user from our database
      const { data: stripeCustomer, error: customerError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('id', userId)
        .maybeSingle();

      console.log('Stripe customer query result:', { data: stripeCustomer, error: customerError });

      if (customerError) {
        console.error('Error retrieving Stripe customer ID:', customerError);
      } else if (stripeCustomer?.stripe_customer_id) {
        stripeCustomerId = stripeCustomer.stripe_customer_id;
        console.log(`Using Stripe customer ID from database: ${stripeCustomerId}`);
      }
    }

    if (!stripeCustomerId) {
      console.log('No Stripe customer ID found for user');
      return new Response(
        JSON.stringify({ plan: 'Free', message: 'No Stripe customer found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Checking Stripe subscriptions for customer: ${stripeCustomerId}`);

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      expand: ['data.items.data.price']
    });

    console.log(`Found ${subscriptions.data.length} active subscriptions in Stripe`);

    if (subscriptions.data.length === 0) {
      console.log('No active Stripe subscriptions found');
      
      // Check for inactive subscriptions too, for debugging
      const inactiveSubscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'all',
        expand: ['data.items.data.price']
      });
      
      console.log(`Found ${inactiveSubscriptions.data.length} total subscriptions (including inactive) in Stripe`);
      if (inactiveSubscriptions.data.length > 0) {
        inactiveSubscriptions.data.forEach(sub => {
          console.log(`Subscription ${sub.id} has status: ${sub.status}`);
        });
      }
      
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
      .upsert({
        id: userId,
        stripe_customer_id: stripeCustomerId,
        subscription_id: latestSubscription.id,
        subscription_status: latestSubscription.status,
        price_id: priceId,
        cancel_at_period_end: latestSubscription.cancel_at_period_end,
        current_period_end: endDate,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      console.error('Error updating subscription in database:', updateError);
    } else {
      console.log('Successfully updated subscription in database');
    }

    return new Response(
      JSON.stringify({ 
        plan, 
        message: 'Active subscription found in Stripe',
        subscriptionEndDate: endDate,
        stripeCustomerId
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
