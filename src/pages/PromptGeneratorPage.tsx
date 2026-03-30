import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import { aiApi } from '@/db/api';

const promptTypes = [
  { value: 'creative-writing', label: 'Creative Writing' },
  { value: 'code-generation', label: 'Code Generation' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'image-generation', label: 'Image Generation' },
  { value: 'video-generation', label: 'Video Generation' },
  { value: 'business', label: 'Business & Marketing' },
  { value: 'education', label: 'Education & Learning' },
  { value: 'research', label: 'Research & Analysis' },
];

export default function PromptGeneratorPage() {
  const [promptType, setPromptType] = useState('creative-writing');
  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      toast.error('Please describe what you want to create');
      return;
    }

    setIsLoading(true);
    try {
      const systemPrompt = `You are an expert prompt engineer. Generate an optimized, detailed prompt for ${promptType} based on the user's request. The prompt should be clear, specific, and effective for AI models.`;
      
      const response = await aiApi.chat([
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I will generate optimized prompts.' }] },
        { role: 'user', parts: [{ text: `Generate an optimized prompt for: ${userInput}` }] }
      ]);

      const reader = response.getReader();
      const decoder = new TextDecoder();
      let result = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          try {
            const jsonStr = trimmedLine.substring(6);
            if (jsonStr === '[DONE]') break;

            const json = JSON.parse(jsonStr);
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
            result += text;
            setGeneratedPrompt(result);
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }

      toast.success('Prompt generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success('Prompt copied to clipboard!');
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        {/* Header */}
        <div className="ios-blur border-b border-border/50 ios-shadow bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alrjkijkqosg.png)]">
          <div className="content-column py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ios-shadow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Prompt Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered prompt optimization for any task</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alrra2835s00.jpg)]">
          <div className="content-column space-y-6">
            {/* Input Card */}
            <Card className="ios-card border-0 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agudphsojj7k.jpg)]">
              <CardHeader>
                <CardTitle>What do you want to create?</CardTitle>
                <CardDescription>Describe your goal and we'll generate an optimized prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prompt Type</Label>
                  <Select value={promptType} onValueChange={setPromptType}>
                    <SelectTrigger className="ios-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alrp0y2cgkjk.jpg)]">
                      {promptTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Your Request</Label>
                  <Textarea
                    placeholder="Example: I want to create a fantasy story about a robot exploring ancient ruins..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="ios-input min-h-[120px] resize-none bg-cover bg-center bg-no-repeat bg-[#1f8fff00] bg-none"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !userInput.trim()}
                  className="w-full ios-button gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Optimized Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Card */}
            {generatedPrompt && (
              <Card className="ios-card border-0 animate-in fade-in slide-in-from-bottom duration-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Generated Prompt</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Use this optimized prompt with any AI model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-2xl p-4 font-mono text-sm whitespace-pre-wrap">
                    {generatedPrompt}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="ios-card border-0 from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-alrqnp7h77r4.jpg)]">
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips for Better Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Be specific about your desired outcome</p>
                <p>• Include context and constraints</p>
                <p>• Mention the style or tone you want</p>
                <p>• Specify the format of the output</p>
                <p>• Add examples if possible</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
