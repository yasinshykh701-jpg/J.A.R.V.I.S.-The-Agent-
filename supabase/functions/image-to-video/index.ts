const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      image,
      prompt,
      model_name = 'kling-v2-6',
      mode = 'pro',
      duration = '5',
      negative_prompt,
      cfg_scale = 0.5,
      image_tail,
      sound = 'on',
      callback_url,
      external_task_id
    } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean base64 image if needed
    let cleanImage = image;
    if (image.includes('base64,')) {
      cleanImage = image.split('base64,')[1];
    }

    const requestBody: any = {
      model_name,
      mode,
      duration,
      image: cleanImage,
      cfg_scale,
      sound
    };

    if (prompt) requestBody.prompt = prompt;
    if (negative_prompt) requestBody.negative_prompt = negative_prompt;
    if (image_tail) requestBody.image_tail = image_tail;
    if (callback_url) requestBody.callback_url = callback_url;
    if (external_task_id) requestBody.external_task_id = external_task_id;

    console.log('Creating image-to-video task');

    const response = await fetch(
      'https://app-8sm6282ej0n5-api-eLMlJj3KJD89.gateway.appmedo.com/v1/videos/image2video',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image-to-video API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Image-to-video generation failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Image-to-video task created:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Image-to-video error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
