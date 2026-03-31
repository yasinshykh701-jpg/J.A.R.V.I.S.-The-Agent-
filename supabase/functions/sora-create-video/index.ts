const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, size, seconds, input_reference, remix_video_id } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'INTEGRATIONS_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build form data
    const formData = new FormData();
    formData.append('model', 'sora-2');
    formData.append('prompt', prompt);
    
    if (size) {
      formData.append('size', size);
    } else {
      formData.append('size', '720x1280'); // Default portrait
    }
    
    if (seconds) {
      formData.append('seconds', seconds.toString());
    } else {
      formData.append('seconds', '4'); // Default 4 seconds
    }
    
    if (remix_video_id) {
      formData.append('remix_video_id', remix_video_id);
    }
    
    // Handle reference image if provided (base64 or file)
    if (input_reference) {
      if (typeof input_reference === 'string' && input_reference.startsWith('data:')) {
        // Convert base64 to blob
        const base64Data = input_reference.split(',')[1];
        const mimeType = input_reference.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const blob = new Blob([binaryData], { type: mimeType });
        formData.append('input_reference', blob, 'reference.jpg');
      }
    }

    console.log('Creating Sora 2 video with prompt:', prompt);

    const response = await fetch(
      'https://plugin-us.openai.azure.com/openai/v1/videos',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sora 2 API error:', response.status, errorText);
      
      // Handle specific error codes
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. This service is 100% free and unlimited - please try again in a moment.',
            status: 'rate_limited'
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Service temporarily unavailable. This service is 100% free and unlimited - our team is resolving this.',
            status: 'service_unavailable'
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Video generation failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Sora 2 video task created:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sora create video error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
