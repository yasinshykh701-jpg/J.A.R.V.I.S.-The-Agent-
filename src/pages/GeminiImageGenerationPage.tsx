import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, Upload, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { supabase } from '@/services/aiServices';

export default function GeminiImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setReferenceImage(base64);
      toast.success('Reference image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const contents: any = {
        contents: [{
          parts: []
        }]
      };

      // Add text prompt
      contents.contents[0].parts.push({ text: prompt });

      // Add reference image if provided
      if (referenceImage) {
        const base64Data = referenceImage.split(',')[1];
        const mimeType = referenceImage.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
        
        contents.contents[0].parts.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }

      const { data, error } = await supabase.functions.invoke('gemini-image-generation', {
        body: contents
      });

      if (error) {
        throw new Error(error.message);
      }

      // Extract generated image from response
      const imageData = data?.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData
      );

      if (imageData?.inlineData?.data) {
        const generatedImageUrl = `data:${imageData.inlineData.mimeType};base64,${imageData.inlineData.data}`;
        setGeneratedImage(generatedImageUrl);
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image data in response');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `gemini-gen-${Date.now()}.png`;
      link.click();
      toast.success('Image downloaded!');
    }
  };

  return (
    <AppLayout>
      <BackToHome />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-white">AI Image Generation</h1>
          </div>
          <p className="text-white/80">
            Generate and edit images with Gemini AI • 100% Free Forever • No Limits
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
              ✓ Lifetime Free Access
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
              ✓ Unlimited Usage
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>
                Describe your image or upload a reference for editing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Description / Editing Instructions</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., 'Replace the background with a sunset' or 'Create a futuristic city'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUpload">Reference Image (Optional)</Label>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Reference Image
                </Button>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {referenceImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={referenceImage}
                    alt="Reference"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>
                Your AI-generated result will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>
                  <Button onClick={handleDownload} className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                  <div className="text-center p-6">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? 'Generating your image...' : 'Your generated image will appear here'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
