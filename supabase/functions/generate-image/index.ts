import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, image } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('INTEGRATIONS_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Submit image generation task
    const submitPayload: any = {
      contents: [{
        parts: []
      }]
    };

    // Add image if provided (image-to-image mode)
    if (image) {
      // Extract base64 data without prefix
      const base64Data = image.includes('base64,') 
        ? image.split('base64,')[1] 
        : image;
      
      submitPayload.contents[0].parts.push({
        inline_data: {
          mime_type: 'image/png',
          data: base64Data
        }
      });
    }

    // Add text prompt
    submitPayload.contents[0].parts.push({
      text: prompt
    });

    console.log('Submitting image generation task...');
    const submitResponse = await fetch(
      'https://app-8sm6282ej0n5-api-zYkZzKQJrBdL.gateway.appmedo.com/image-generation/submit',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload),
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('Submit API error:', submitResponse.status, errorText);
      
      if (submitResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (submitResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Insufficient balance. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: `API error: ${errorText}` }),
        { status: submitResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const submitResult = await submitResponse.json();
    console.log('Task submitted:', submitResult);

    if (submitResult.status !== 0 || !submitResult.data?.taskId) {
      return new Response(
        JSON.stringify({ error: submitResult.message || 'Failed to submit task' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const taskId = submitResult.data.taskId;

    // Step 2: Poll for task completion (max 10 minutes)
    const maxAttempts = 60; // 60 attempts * 10 seconds = 10 minutes
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      attempts++;

      console.log(`Polling attempt ${attempts}/${maxAttempts} for task ${taskId}`);

      const queryResponse = await fetch(
        `https://app-8sm6282ej0n5-api-zYkZzKQJrBdL.gateway.appmedo.com/image-generation/query?taskId=${taskId}`,
        {
          method: 'GET',
          headers: {
            'X-Gateway-Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      if (!queryResponse.ok) {
        console.error('Query API error:', queryResponse.status);
        continue; // Retry on error
      }

      const queryResult = await queryResponse.json();
      console.log('Task status:', queryResult.data?.status);

      if (queryResult.status === 0 && queryResult.data) {
        const taskStatus = queryResult.data.status;

        if (taskStatus === 'SUCCESS') {
          // Task completed successfully
          const imageUrl = queryResult.data.imageUrl || queryResult.data.result?.imageUrl;
          
          if (!imageUrl) {
            return new Response(
              JSON.stringify({ error: 'No image URL in response' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              imageUrl,
              taskId 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (taskStatus === 'FAILED') {
          return new Response(
            JSON.stringify({ error: 'Image generation failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        // Status is PENDING or PROCESSING, continue polling
      }
    }

    // Timeout after max attempts
    return new Response(
      JSON.stringify({ error: 'Image generation timeout. Please try again.' }),
      { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
