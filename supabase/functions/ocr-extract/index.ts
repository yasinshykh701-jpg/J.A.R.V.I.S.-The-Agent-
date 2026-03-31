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
    const { base64Image, language = 'eng' } = body;

    if (!base64Image) {
      return new Response(
        JSON.stringify({ error: 'base64Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create form data for OCR API
    const formData = new FormData();
    formData.append('base64Image', base64Image);
    formData.append('language', language);
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('OCREngine', '2'); // Engine 2 for automatic language detection

    const response = await fetch(
      'https://app-8sm6282ej0n5-api-W9z3M6eONl3L.gateway.appmedo.com/parse/image',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OCR API error:', data);
      return new Response(
        JSON.stringify({ error: data.ErrorMessage || 'OCR extraction failed' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if OCR was successful
    if (data.OCRExitCode !== 1 && data.OCRExitCode !== 2) {
      throw new Error(data.ErrorMessage || 'OCR processing failed');
    }

    // Extract text from all parsed results
    const extractedText = data.ParsedResults?.map((result: any) => result.ParsedText).join('\n\n') || '';

    if (!extractedText.trim()) {
      throw new Error('No text could be extracted from the image');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        text: extractedText,
        processingTime: data.ProcessingTimeInMilliseconds
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ocr-extract:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
