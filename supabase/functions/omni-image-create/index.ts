import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt,
      resolution = '1k',
      aspect_ratio = '16:9',
      n = 1,
      result_type = 'single',
      series_amount,
      image_list,
      element_list
    } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate series_amount constraint
    if (result_type === 'series' && !series_amount) {
      return new Response(
        JSON.stringify({ error: 'series_amount is required when result_type is series' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (result_type === 'single' && series_amount) {
      return new Response(
        JSON.stringify({ error: 'series_amount must not be provided when result_type is single' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API key from environment
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare request body
    const requestBody: any = {
      model_name: 'kling-image-o1',
      prompt,
      resolution,
      aspect_ratio,
      n,
      result_type,
      watermark_info: { enabled: false }
    };

    // Add series_amount only if result_type is series
    if (result_type === 'series') {
      requestBody.series_amount = series_amount;
    }

    // Add optional fields
    if (image_list) requestBody.image_list = image_list;
    if (element_list) requestBody.element_list = element_list;

    // Call Omni-Image API
    const response = await fetch(
      'https://app-8sm6282ej0n5-api-2Y00Vzbe0MBY.gateway.appmedo.com/v1/images/omni-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Omni-Image API error:', data);
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Image generation failed',
          details: data
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in omni-image-create:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
