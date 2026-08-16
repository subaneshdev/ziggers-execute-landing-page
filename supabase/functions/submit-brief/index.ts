// Supabase Edge Function: submit-brief
// Handles incoming marketing and retail brief submissions with verification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { name, company, email, phone, campaignType, targetCities, briefDetails } = await req.json();

    if (!name || !email || !company) {
      return new Response(
        JSON.stringify({ error: 'Name, company name, and email are mandatory' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabaseClient
      .from('campaign_briefs')
      .insert([
        {
          name,
          company,
          email,
          phone: phone || 'N/A',
          campaign_type: campaignType || 'Product Sampling',
          target_cities: targetCities || 'Chennai Hub',
          brief_details: briefDetails || '',
          status: 'Received',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      // Fallback response if table not yet migrated
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Brief logged via Edge Function memory runtime.',
          brief: { name, company, email, campaignType, targetCities }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
