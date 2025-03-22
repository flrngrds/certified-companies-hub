
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  console.log("Webhook received:", req.method);
  
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialiser Stripe avec la clé secrète
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Initialiser le client Supabase avec la clé de service
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Récupérer la signature du webhook depuis les en-têtes
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('Signature manquante dans les en-têtes:', Object.fromEntries(req.headers.entries()));
      return new Response(
        JSON.stringify({ error: 'Signature Stripe manquante' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Récupérer le contenu brut de la requête
    const body = await req.text();
    console.log("Contenu du webhook reçu:", body.substring(0, 100) + "...");

    // Vérifier la signature du webhook pour sécuriser les appels
    let event;
    try {
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET non configuré');
      }
      
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Erreur de signature du webhook: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Erreur de signature du webhook: ${err.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Événement Stripe reçu: ${event.type}`);

    // Traiter différents types d'événements Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log("Session de paiement complétée:", session.id);
        
        // Mettre à jour l'abonnement dans la base de données
        await handleCheckoutCompleted(supabaseClient, stripe, session);
        break;
        
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        console.log("Abonnement mis à jour:", subscription.id);
        
        // Mettre à jour le statut de l'abonnement
        await handleSubscriptionUpdate(supabaseClient, subscription);
        break;

      default:
        console.log(`Type d'événement non géré: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Erreur dans le webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Fonction pour gérer les événements checkout.session.completed
async function handleCheckoutCompleted(supabaseClient, stripe, session) {
  // Récupérer le client Stripe
  const customer = session.customer;
  console.log("Traitement du checkout pour le client:", customer);
  
  // Récupérer l'abonnement si disponible
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const priceId = subscription.items.data[0].price.id;
    console.log("Abonnement trouvé avec price_id:", priceId);
    
    // Rechercher dans la base de données un utilisateur associé à ce client Stripe
    const { data: users, error: usersError } = await supabaseClient
      .from('stripe_customers')
      .select('id')
      .eq('stripe_customer_id', customer)
      .maybeSingle();
      
    if (usersError) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', usersError);
      return;
    }
    
    if (users) {
      console.log("Utilisateur trouvé pour le client Stripe:", users.id);
      
      // Mettre à jour les informations d'abonnement
      const { error: updateError } = await supabaseClient
        .from('stripe_customers')
        .update({
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          price_id: priceId,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        })
        .eq('id', users.id);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour de l\'abonnement:', updateError);
      } else {
        console.log('Abonnement mis à jour avec succès pour l\'utilisateur:', users.id);
      }
    } else {
      console.log('Aucun utilisateur trouvé pour le client Stripe:', customer);
      // Rechercher l'utilisateur via le client Stripe
      try {
        const stripeCustomer = await stripe.customers.retrieve(customer);
        if (stripeCustomer && stripeCustomer.email) {
          console.log("Email du client Stripe trouvé:", stripeCustomer.email);
          
          // Rechercher l'utilisateur par email
          const { data: authUser } = await supabaseClient
            .auth
            .admin
            .listUsers();
          
          const matchingUser = authUser.users.find(u => u.email === stripeCustomer.email);
          
          if (matchingUser) {
            console.log("Utilisateur Supabase trouvé par email:", matchingUser.id);
            
            // Insérer ou mettre à jour les informations du client Stripe
            const { error: upsertError } = await supabaseClient
              .from('stripe_customers')
              .upsert({
                id: matchingUser.id,
                stripe_customer_id: customer,
                subscription_id: subscription.id,
                subscription_status: subscription.status,
                price_id: priceId,
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date().toISOString()
              });
              
            if (upsertError) {
              console.error('Erreur lors de l\'insertion des données client:', upsertError);
            } else {
              console.log('Client Stripe créé avec succès pour l\'utilisateur:', matchingUser.id);
            }
          } else {
            console.log("Aucun utilisateur trouvé avec l'email:", stripeCustomer.email);
          }
        }
      } catch (stripeError) {
        console.error("Erreur lors de la récupération du client Stripe:", stripeError);
      }
    }
  }
}

// Fonction pour gérer les mises à jour d'abonnement
async function handleSubscriptionUpdate(supabaseClient, subscription) {
  // Récupérer l'ID du client Stripe
  const customer = subscription.customer;
  console.log("Mise à jour de l'abonnement pour le client:", customer);
  
  // Récupérer l'utilisateur associé à ce client Stripe
  const { data: users, error: usersError } = await supabaseClient
    .from('stripe_customers')
    .select('id')
    .eq('stripe_customer_id', customer)
    .maybeSingle();
    
  if (usersError) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', usersError);
    return;
  }
  
  if (users) {
    console.log("Utilisateur trouvé pour le client Stripe:", users.id);
    
    // Obtenir le premier élément de l'abonnement pour récupérer le price_id
    const priceId = subscription.items.data[0].price.id;
    
    // Mettre à jour les informations d'abonnement
    const { error: updateError } = await supabaseClient
      .from('stripe_customers')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        price_id: priceId,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString()
      })
      .eq('id', users.id);
      
    if (updateError) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', updateError);
    } else {
      console.log('Abonnement mis à jour avec succès pour l\'utilisateur:', users.id);
    }
  } else {
    console.error('Aucun utilisateur trouvé pour le client Stripe:', customer);
  }
}
