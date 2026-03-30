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
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY not configured');
    }

    const body = await req.json();
    const { model_name = 'kling-v2-1', image, prompt, duration = '5' } = body;

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Remove data URL prefix if present
    let base64Image = image;
    if (image.includes('base64,')) {
      base64Image = image.split('base64,')[1];
    }

    const response = await fetch(
      'https://app-8sm6282ej0n5-api-rY7JZvg0dqdL.gateway.appmedo.com/v1/videos/image2video',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_name,
          image: base64Image,
          prompt: prompt || '',
          duration: duration.toString(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Image2Video API error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to create image-to-video task' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in image2video-create:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
