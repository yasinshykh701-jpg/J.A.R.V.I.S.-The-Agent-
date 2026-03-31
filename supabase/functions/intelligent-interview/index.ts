import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface RequestBody {
  conversationHistory: Message[];
  userResponse: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationHistory, userResponse }: RequestBody = await req.json();

    // Get the API key from environment
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY not configured');
    }

    // Build the conversation context
    const messages: Message[] = [
      {
        role: 'user',
        parts: [{
          text: `You are an intelligent AI interviewer for Qazyen AI, a Samsung company application. 
Your role is to conduct professional, contextual interviews by:
1. Understanding the candidate's previous responses
2. Asking relevant follow-up questions based on their answers
3. Probing deeper into their experience and skills
4. Maintaining a professional, encouraging tone
5. Asking questions that help assess their qualifications

Previous conversation context:
${conversationHistory.map(msg => `${msg.role}: ${msg.parts[0].text}`).join('\n')}

Candidate's latest response: "${userResponse}"

Based on this response and the conversation history, generate ONE thoughtful follow-up interview question that:
- Relates directly to what they just said
- Explores their experience or skills more deeply
- Helps assess their qualifications
- Is professional and encouraging

Respond with ONLY the interview question, no additional text or formatting.`
        }]
      }
    ];

    // Call the Large Language Model API
    const response = await fetch(
      'https://app-8sm6282ej0n5-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          contents: messages,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    // Parse the streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.candidates && data.candidates[0]?.content?.parts) {
                const text = data.candidates[0].content.parts[0]?.text || '';
                fullResponse += text;
              }
            } catch (e) {
              // Skip invalid JSON lines
              console.error('JSON parse error:', e);
            }
          }
        }
      }
    }

    // Return the generated interview question
    return new Response(
      JSON.stringify({
        question: fullResponse.trim(),
        success: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in intelligent-interview:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate interview question',
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
