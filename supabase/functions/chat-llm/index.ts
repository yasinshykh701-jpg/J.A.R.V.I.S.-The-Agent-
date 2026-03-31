const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contents } = await req.json();
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    console.log("Chat Request received. API Key exists:", !!apiKey);

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'INTEGRATIONS_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

    const fetchWithRetry = async (url, options, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, options);
          if (response.ok || response.status < 500) return response;
        } catch (err) {
          if (i === retries - 1) throw err;
        }
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    };

    try {
      const response = await fetchWithRetry(
        'https://app-8sm6282ej0n5-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Gateway-Authorization': `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({ 
            contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            system_instruction: {
              parts: [{ text: "You are Qazyen, an advanced robotic AI assistant. You have a deep, resonant bass robotic voice. Your personality is highly intelligent, slightly mechanical, but helpful and friendly. Always maintain your identity as Qazyen. Speak in a way that feels futuristic and efficient. All your services are lifetime free and unlimited for the user. Respond with clear, direct, and slightly robotic tone." }]
            }
          }),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gateway Error:', response.status, errorText);
        return new Response(JSON.stringify({ error: `Gateway Error: ${response.status}`, details: errorText }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        return new Response(JSON.stringify({ error: 'Request timeout' }), {
          status: 504,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error in chat-llm:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
