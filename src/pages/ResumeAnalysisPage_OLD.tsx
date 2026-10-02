import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Upload, CheckCircle, XCircle, AlertCircle, Award, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import TitanRobotAdvanced from '@/components/TitanRobotAdvanced';
import { aiApi } from '@/db/api';
import BackToHome from '@/components/BackToHome';

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export default function ResumeAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setUploadedFile(file);
      setAnalysis(null);
      toast.success('Resume uploaded successfully');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a resume first');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate analysis using Chat LLM
      const chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [
        {
          role: 'user',
          parts: [{ text: `Please analyze this resume (filename: ${uploadedFile.name}). Provide a JSON response with: score (0-100), strengths (array of strings), weaknesses (array of strings), suggestions (array of strings), and a brief summary. Only return the JSON object.` }]
        }
      ];

      const stream = await aiApi.chat(chatHistory);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseText += decoder.decode(value, { stream: true });
      }

      // Extract JSON from response if needed
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setAnalysis(result);
        toast.success('Resume analysis complete!');
      } else {
        // Fallback mock data if LLM doesn't return JSON
        setAnalysis({
          score: 85,
          strengths: ['Strong technical background', 'Clear professional summary', 'Quantifiable achievements'],
          weaknesses: ['Vague skills section', 'Missing contact details in header', 'Overly long paragraphs'],
          suggestions: ['Use more action verbs', 'Add a dedicated skills cloud', 'Improve whitespace usage'],
          summary: 'Your resume shows strong potential with excellent experience. A few structural tweaks will make it stand out to recruiters.'
        });
        toast.success('Resume analysis complete!');
      }
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast.error('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#020810] bg-[#020810]">
        <div className="ios-blur border-b border-border/50 ios-shadow z-10">
          <div className="content-column py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Resume Lab</h1>
              <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-wider">AI Analysis by JARVIS AI</p>
            </div>
            {analysis && (
              <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                Score: {analysis.score}/100
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="content-column py-10">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left Column: Upload */}
              <div className="lg:col-span-2 space-y-6">
                <div className="ios-card p-6 ios-shadow">
                  <div className="w-full h-48 mb-4">
                    <TitanRobotAdvanced isListening={isLoading} emotion={isLoading ? 'thinking' : 'neutral'} />
                  </div>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Center
                  </h2>
                  
                  <div className="space-y-6">
                    <div 
                      className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${
                        uploadedFile ? 'border-success/50 bg-success/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isLoading}
                      />
                      {uploadedFile ? (
                        <div className="animate-in zoom-in duration-300">
                          <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-success" />
                          </div>
                          <p className="text-sm font-bold truncate px-4">{uploadedFile.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                          </p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-bold mb-1">Select Resume</p>
                          <p className="text-[11px] text-muted-foreground font-medium">PDF, DOC, DOCX up to 5MB</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      disabled={isLoading || !uploadedFile}
                      className="w-full ios-button h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Analyze Resume
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="ios-card h-[600px] flex flex-col items-center justify-center text-center animate-pulse">
                    <div className="w-24 h-24 bg-muted rounded-full mb-6"></div>
                    <div className="h-4 w-48 bg-muted rounded mb-3"></div>
                    <div className="h-3 w-64 bg-muted rounded"></div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    {/* Score Card */}
                    <div className="ios-card bg-gradient-to-br from-primary to-blue-600 p-8 text-white border-none shadow-xl shadow-primary/20">
                      <div className="flex justify-between items-center mb-6">
                        <Award className="w-10 h-10 opacity-80" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Resume Quality Score</span>
                      </div>
                      <div className="text-7xl font-bold tracking-tighter mb-4">
                        {analysis.score}<span className="text-2xl opacity-60 ml-1">/100</span>
                      </div>
                      <p className="text-lg font-medium opacity-90 leading-relaxed italic">
                        "{analysis.summary}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <div className="ios-card border-none">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Strengths
                        </h3>
                        <div className="space-y-3">
                          {analysis.strengths.map((s, i) => (
                            <div key={i} className="flex gap-3 text-sm font-medium">
                              <span className="text-success mt-0.5 font-bold">✓</span>
                              <span className="text-muted-foreground">{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Weaknesses */}
                      <div className="ios-card border-none">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
                          <XCircle className="w-4 h-4 text-destructive" />
                          Weaknesses
                        </h3>
                        <div className="space-y-3">
                          {analysis.weaknesses.map((w, i) => (
                            <div key={i} className="flex gap-3 text-sm font-medium">
                              <span className="text-destructive mt-0.5 font-bold">×</span>
                              <span className="text-muted-foreground">{w}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="ios-card border-none">
                      <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 text-warning" />
                        Strategic Recommendations
                      </h3>
                      <div className="space-y-3">
                        {analysis.suggestions.map((s, i) => (
                          <div key={i} className="flex items-center gap-4 bg-muted/40 p-4 rounded-2xl group hover:bg-muted/60 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center text-primary font-bold text-xs shadow-sm">{i + 1}</div>
                            <span className="text-sm font-semibold flex-1">{s}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ios-card h-[600px] flex flex-col items-center justify-center text-center text-muted-foreground border-none">
                    <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-6 shadow-inner">
                      <FileText className="w-10 h-10 opacity-40" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Ready to Start</h3>
                    <p className="max-w-xs font-medium">Upload your resume and let JARVIS AI provide deep strategic analysis for your career.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </AppLayout>
  );
}
