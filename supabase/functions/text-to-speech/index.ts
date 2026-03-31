const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input, voice = 'alloy', response_format = 'mp3' } = await req.json();

    if (!input) {
      return new Response(
        JSON.stringify({ error: 'Input text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the API key from environment (auto-injected by platform)
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('CRITICAL: INTEGRATIONS_API_KEY not found in environment');
      console.error('Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured', 
          message: 'The INTEGRATIONS_API_KEY is not available. Please ensure the Edge Function is deployed with the correct plugin ID (622d8cd1-cfa2-45b4-8440-f9e4125c46da).'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('TTS Request - Text length:', input.length, 'Voice:', voice, 'Format:', response_format);
    console.log('Using API endpoint: https://app-8sm6282ej0n5-api-GYX1lzGw01Xa.gateway.appmedo.com/v1/audio/speech');
    console.log('API Key available:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO');

    // Call the Text-to-Speech API with correct authentication
    const response = await fetch(
      'https://app-8sm6282ej0n5-api-GYX1lzGw01Xa.gateway.appmedo.com/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input,
          voice,
          response_format
        }),
      }
    );

    console.log('TTS API Response Status:', response.status, response.statusText);
    console.log('TTS API Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS API error response:', errorText);
      
      // Parse error if it's JSON
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = JSON.stringify(errorJson, null, 2);
      } catch (e) {
        // Not JSON, use as is
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Speech generation failed', 
          details: errorDetails,
          status: response.status,
          endpoint: 'https://app-8sm6282ej0n5-api-GYX1lzGw01Xa.gateway.appmedo.com/v1/audio/speech',
          message: 'The Text-to-Speech API returned an error. This may indicate an issue with the API key or endpoint configuration.'
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const audioData = await response.arrayBuffer();
    console.log('TTS Success - Audio size:', audioData.byteLength, 'bytes');

    if (audioData.byteLength === 0) {
      console.error('Received empty audio data from API');
      return new Response(
        JSON.stringify({ error: 'Received empty audio data from API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(audioData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/octet-stream',
        'Content-Length': audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    console.error('Error stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        type: 'server_error',
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
