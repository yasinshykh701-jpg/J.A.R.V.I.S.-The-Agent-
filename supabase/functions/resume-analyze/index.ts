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
    const { resumeText } = body;

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'resumeText is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisPrompt = `You are an expert resume analyst and career coach. Analyze the following resume text and provide a comprehensive analysis.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "score": 85,
  "summary": "Brief 2-3 sentence overview of the resume",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "experience": "Brief summary of work experience",
  "education": "Brief summary of education",
  "atsCompatibility": 75,
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Analysis criteria:
- Score (0-100): Overall resume quality
- ATS Compatibility (0-100): How well it works with Applicant Tracking Systems
- Identify key skills, experience level, and education
- Highlight strengths (what's done well)
- Point out weaknesses (what needs improvement)
- Provide actionable suggestions for improvement
- Give specific recommendations for career advancement

Resume Text:
${resumeText}`;

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
              parts: [{ text: analysisPrompt }]
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

    // Parse the analysis result
    let analysisData;
    try {
      // Remove markdown code blocks if present
      let cleanedText = fullText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse analysis result:', fullText);
      throw new Error('Failed to parse resume analysis from AI response');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in resume-analyze:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
