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
    const { prompt, slideCount = 5, theme = 'professional' } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a detailed prompt for PPT generation
    const systemPrompt = `You are an expert presentation designer. Generate a complete presentation with ${slideCount} slides based on the user's topic.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "layout": "title"
    }
  ]
}

Layout types: "title" (first slide), "content" (bullet points), "two-column" (split content)

Rules:
- First slide must have layout "title" with presentation title and subtitle
- Each slide should have 3-5 bullet points
- Content should be concise and professional
- Use ${theme} theme style in content tone
- Return ONLY the JSON object, no other text`;

    const response = await fetch(
      'https://app-8sm6282ej0n5-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `\n\nTopic: ${prompt}` }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    // Read the SSE stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.candidates?.[0]?.content?.parts?.[0]?.text) {
                fullText += jsonData.candidates[0].content.parts[0].text;
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    }

    // Parse the generated content
    let presentationData;
    try {
      // Remove markdown code blocks if present
      let cleanedText = fullText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      presentationData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse generated content:', fullText);
      throw new Error('Failed to parse presentation data from AI response');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        presentation: presentationData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-ppt-generate:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
