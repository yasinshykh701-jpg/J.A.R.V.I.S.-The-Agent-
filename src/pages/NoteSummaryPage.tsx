import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { FileText, Upload, Loader2, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import { aiApi } from '@/db/api';
import BackToHome from '@/components/BackToHome';

export default function NoteSummaryPage() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [bulletPoints, setBulletPoints] = useState('');
  const [keyInsights, setKeyInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      toast.success('File loaded successfully!');
    };

    reader.readAsText(uploadedFile);
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text or upload a document');
      return;
    }

    setIsLoading(true);
    try {
      // Generate comprehensive summary
      const summaryPrompt = `Provide a comprehensive summary of the following text:\n\n${inputText}`;
      const summaryResponse = await aiApi.chat([
        { role: 'user', parts: [{ text: summaryPrompt }] }
      ]);

      let summaryText = '';
      const summaryReader = summaryResponse.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await summaryReader.read();
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
            summaryText += text;
            setSummary(summaryText);
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }

      // Generate bullet points
      const bulletPrompt = `Extract key points as bullet points from the following text:\n\n${inputText}`;
      const bulletResponse = await aiApi.chat([
        { role: 'user', parts: [{ text: bulletPrompt }] }
      ]);

      let bulletText = '';
      const bulletReader = bulletResponse.getReader();
      buffer = '';

      while (true) {
        const { done, value } = await bulletReader.read();
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
            bulletText += text;
            setBulletPoints(bulletText);
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }

      // Generate key insights
      const insightsPrompt = `Extract key insights and important takeaways from the following text:\n\n${inputText}`;
      const insightsResponse = await aiApi.chat([
        { role: 'user', parts: [{ text: insightsPrompt }] }
      ]);

      let insightsText = '';
      const insightsReader = insightsResponse.getReader();
      buffer = '';

      while (true) {
        const { done, value } = await insightsReader.read();
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
            insightsText += text;
            setKeyInsights(insightsText);
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }

      toast.success('Summary generated successfully!');
    } catch (error: any) {
      console.error('Summarization error:', error);
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const content = `SUMMARY\n\n${summary}\n\n\nKEY POINTS\n\n${bulletPoints}\n\n\nKEY INSIGHTS\n\n${keyInsights}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 from-[#030508] via-[#040c18] to-[#030508]">
        {/* Header */}
        <div className="ios-blur border-b border-border/50 ios-shadow">
          <div className="content-column py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center ios-shadow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Smart Note Summary</h1>
                <p className="text-sm text-muted-foreground">AI-powered document summarization and insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="content-column space-y-6">
            {/* Input Card */}
            <Card className="ios-card border-0">
              <CardHeader>
                <CardTitle>Input Document</CardTitle>
                <CardDescription>Paste text or upload a document (PDF, DOCX, TXT)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="ios-button inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted hover:bg-muted/80">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt,.pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {file.name}
                    </div>
                  )}
                </div>

                <Textarea
                  placeholder="Paste your text here or upload a document..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="ios-input min-h-[200px] resize-none font-mono text-sm"
                />

                <Button
                  onClick={handleSummarize}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full ios-button gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {(summary || bulletPoints || keyInsights) && (
              <Card className="ios-card border-0 animate-in fade-in slide-in-from-bottom duration-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Summary Results</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="bullets">Key Points</TabsTrigger>
                      <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(summary)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted/50 rounded-2xl p-4 text-sm whitespace-pre-wrap">
                        {summary}
                      </div>
                    </TabsContent>

                    <TabsContent value="bullets" className="space-y-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(bulletPoints)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted/50 rounded-2xl p-4 text-sm whitespace-pre-wrap">
                        {bulletPoints}
                      </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(keyInsights)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted/50 rounded-2xl p-4 text-sm whitespace-pre-wrap">
                        {keyInsights}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
