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
      duration = '5', 
      aspect_ratio = '16:9',
      mode = 'pro',
      image_url,
      multi_shot = false,
      multi_prompt
    } = await req.json();

    if (!prompt && !multi_prompt) {
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
      model_name: 'kling-v3-omni',
      duration,
      mode,
      aspect_ratio,
      sound: 'on',
      watermark_info: { enabled: false }
    };

    // Handle multi-shot or single prompt
    if (multi_shot && multi_prompt) {
      requestBody.multi_shot = true;
      requestBody.shot_type = 'customize';
      requestBody.multi_prompt = multi_prompt;
    } else {
      requestBody.prompt = prompt;
    }

    // Add image reference if provided
    if (image_url) {
      requestBody.image_list = [{ image_url }];
    }

    // Call Omni-Video API
    const response = await fetch(
      'https://app-8sm6282ej0n5-api-k93RvqRrRZba.gateway.appmedo.com/v1/videos/omni-video',
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
      console.error('Omni-Video API error:', data);
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Video generation failed',
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
    console.error('Error in omni-video-create:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
