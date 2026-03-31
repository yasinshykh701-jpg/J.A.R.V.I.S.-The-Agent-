import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileText, Upload, CheckCircle, XCircle, AlertCircle, Award, Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { supabase } from '@/services/aiServices';

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills: string[];
  experience: string;
  education: string;
  atsCompatibility: number;
  recommendations: string[];
}

export default function ResumeAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and PDF files are supported');
        return;
      }

      setUploadedFile(file);
      setAnalysis(null);
      setExtractedText('');
      toast.success('Resume uploaded successfully');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a resume first');
      return;
    }

    setIsLoading(true);
    setIsExtracting(true);

    try {
      // Step 1: Extract text from resume using OCR
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;

          // Extract text using OCR
          const { data: ocrData, error: ocrError } = await supabase.functions.invoke('ocr-extract', {
            body: {
              base64Image: base64,
              language: 'eng'
            }
          });

          if (ocrError) {
            throw ocrError;
          }

          if (!ocrData?.text) {
            throw new Error('No text could be extracted from the resume');
          }

          setExtractedText(ocrData.text);
          setIsExtracting(false);
          toast.success('✓ Text extracted successfully');

          // Step 2: Analyze the extracted text
          const { data: analysisData, error: analysisError } = await supabase.functions.invoke('resume-analyze', {
            body: {
              resumeText: ocrData.text
            }
          });

          if (analysisError) {
            throw analysisError;
          }

          if (analysisData?.analysis) {
            setAnalysis(analysisData.analysis);
            toast.success('✨ Resume analysis complete!');
          } else {
            throw new Error('No analysis data received');
          }
        } catch (error: any) {
          console.error('Analysis error:', error);
          toast.error(error.message || 'Failed to analyze resume');
        } finally {
          setIsLoading(false);
          setIsExtracting(false);
        }
      };

      reader.readAsDataURL(uploadedFile);
    } catch (error: any) {
      console.error('Resume analysis error:', error);
      toast.error(error.message || 'Failed to analyze resume');
      setIsLoading(false);
      setIsExtracting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <BackToHome />
        
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  AI Resume Analyzer
                </h1>
                <p className="text-muted-foreground mt-1">
                  Get AI-powered insights and recommendations • 100% Free Forever
                </p>
              </div>
              {analysis && (
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Resume
                  </CardTitle>
                  <CardDescription>
                    Upload your resume for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    {!uploadedFile ? (
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full h-32 border-dashed border-2"
                      >
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG, PDF (Max 5MB)
                          </p>
                        </div>
                      </Button>
                    ) : (
                      <div className="border-2 border-primary/50 rounded-lg p-4 bg-primary/5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setUploadedFile(null);
                              setAnalysis(null);
                              setExtractedText('');
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!uploadedFile || isLoading}
                    className="w-full gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isExtracting ? 'Extracting Text...' : 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Resume
                      </>
                    )}
                  </Button>

                  {isLoading && (
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                      {isExtracting ? (
                        <p>📄 Extracting text from resume...</p>
                      ) : (
                        <p>🤖 AI is analyzing your resume...</p>
                      )}
                      <p className="text-xs">This may take 10-30 seconds</p>
                    </div>
                  )}

                  {analysis && (
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Overall Score</span>
                        <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                          {analysis.score}/100
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">ATS Score</span>
                        <span className={`font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                          {analysis.atsCompatibility}/100
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {!analysis ? (
                <Card className="h-full min-h-[600px] flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload your resume and click "Analyze Resume" to get AI-powered insights
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Score Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Score Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Quality</span>
                            <span className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
                              {analysis.score}%
                            </span>
                          </div>
                          <Progress value={analysis.score} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {getScoreLabel(analysis.score)}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">ATS Compatibility</span>
                            <span className={`text-lg font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                              {analysis.atsCompatibility}%
                            </span>
                          </div>
                          <Progress value={analysis.atsCompatibility} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {getScoreLabel(analysis.atsCompatibility)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{analysis.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Weaknesses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Lightbulb className="w-5 h-5" />
                        Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Skills & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Key Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysis.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
