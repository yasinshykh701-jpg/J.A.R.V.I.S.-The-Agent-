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
      negative_prompt,
      image,
      image_fidelity = 0.5,
      resolution = '1k',
      n = 1,
      aspect_ratio = '16:9',
      element_list
    } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
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
      model_name: 'kling-v1',
      prompt,
      resolution,
      n,
      aspect_ratio,
      watermark_info: { enabled: false }
    };

    // Add optional fields
    if (negative_prompt) requestBody.negative_prompt = negative_prompt;
    if (image) {
      requestBody.image = image;
      requestBody.image_fidelity = image_fidelity;
    }
    if (element_list) requestBody.element_list = element_list;

    // Call Kling AI Image Generation API
    const response = await fetch(
      'https://app-8sm6282ej0n5-api-DY8MnRlwkXKa.gateway.appmedo.com/v1/images/generations',
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
      console.error('Kling AI Image API error:', data);
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
    console.error('Error in kling-image-create:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
