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
      prompt, 
      model_name = 'kling-v2-5-turbo',
      aspect_ratio = '16:9',
      duration = '5',
      negative_prompt,
      cfg_scale,
      callback_url,
      external_task_id
    } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
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

    const requestBody: any = {
      prompt,
      model_name,
      aspect_ratio,
      duration
    };

    if (negative_prompt) requestBody.negative_prompt = negative_prompt;
    if (cfg_scale !== undefined) requestBody.cfg_scale = cfg_scale;
    if (callback_url) requestBody.callback_url = callback_url;
    if (external_task_id) requestBody.external_task_id = external_task_id;

    console.log('Creating text-to-video task:', requestBody);

    const response = await fetch(
      'https://app-8sm6282ej0n5-api-qYGWo8XA7JVY.gateway.appmedo.com/v1/videos/text2video',
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
      console.error('Text-to-video API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Video generation failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Text-to-video task created:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Text-to-video error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
