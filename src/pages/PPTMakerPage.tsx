import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Presentation, Download, Plus, Trash2, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import { supabase } from '@/services/aiServices';
import BackToHome from '@/components/BackToHome';

interface Slide {
  slideNumber: number;
  title: string;
  content: string[];
  layout: 'title' | 'content' | 'two-column';
}

interface Presentation {
  title: string;
  slides: Slide[];
}

export default function PPTMakerPage() {
  const [prompt, setPrompt] = useState('');
  const [slideCount, setSlideCount] = useState('5');
  const [theme, setTheme] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleGeneratePresentation = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a presentation topic');
      return;
    }

    setIsGenerating(true);
    setPresentation(null);
    setCurrentSlideIndex(0);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-ppt-generate', {
        body: {
          prompt,
          slideCount: parseInt(slideCount),
          theme
        }
      });

      if (error) {
        throw error;
      }

      if (data?.presentation) {
        setPresentation(data.presentation);
        toast.success(`✨ Presentation generated with ${data.presentation.slides.length} slides!`);
      } else {
        throw new Error('No presentation data received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPPT = () => {
    if (!presentation) {
      toast.error('No presentation to download');
      return;
    }

    // Create a simple text version for download
    let content = `${presentation.title}\n${'='.repeat(presentation.title.length)}\n\n`;
    
    presentation.slides.forEach((slide) => {
      content += `\nSlide ${slide.slideNumber}: ${slide.title}\n${'-'.repeat(slide.title.length + 10)}\n`;
      slide.content.forEach((point) => {
        content += `• ${point}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Presentation downloaded!');
  };

  const nextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const currentSlide = presentation?.slides[currentSlideIndex];

  const getThemeColors = () => {
    switch (theme) {
      case 'professional':
        return 'from-blue-600 to-blue-800';
      case 'creative':
        return 'from-purple-600 to-pink-600';
      case 'minimal':
        return 'from-gray-700 to-gray-900';
      case 'vibrant':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-blue-600 to-blue-800';
    }
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
                  <Presentation className="w-8 h-8 text-primary" />
                  AI PPT Maker
                </h1>
                <p className="text-muted-foreground mt-1">
                  Generate professional presentations with AI • Like Gamma • 100% Free Forever
                </p>
              </div>
              {presentation && (
                <Button
                  onClick={handleDownloadPPT}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Generate Presentation
                  </CardTitle>
                  <CardDescription>
                    Describe your presentation topic and let AI create it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Presentation Topic *</Label>
                    <Textarea
                      id="prompt"
                      placeholder="E.g., 'Introduction to Artificial Intelligence', 'Marketing Strategy for 2026', 'Climate Change Solutions'..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slideCount">Number of Slides</Label>
                      <Select value={slideCount} onValueChange={setSlideCount}>
                        <SelectTrigger id="slideCount">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 slides</SelectItem>
                          <SelectItem value="5">5 slides</SelectItem>
                          <SelectItem value="7">7 slides</SelectItem>
                          <SelectItem value="10">10 slides</SelectItem>
                          <SelectItem value="15">15 slides</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="vibrant">Vibrant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGeneratePresentation}
                    disabled={isGenerating}
                    className="w-full gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Presentation
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="text-center text-sm text-muted-foreground">
                      <p>⚡ AI is creating your presentation...</p>
                      <p className="text-xs mt-1">This may take 10-30 seconds</p>
                    </div>
                  )}

                  {presentation && (
                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status</span>
                          <span className="text-green-600 font-medium">✓ Generated</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Slides</span>
                          <span className="font-medium">{presentation.slides.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Theme</span>
                          <span className="font-medium capitalize">{theme}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              {!presentation ? (
                <Card className="h-full min-h-[600px] flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Presentation className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Presentation Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a topic and click "Generate Presentation" to create your slides with AI
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Slide Preview */}
                  <Card className="overflow-hidden">
                    <div className={`aspect-video bg-gradient-to-br ${getThemeColors()} p-8 flex flex-col justify-center items-center text-white relative`}>
                      {currentSlide?.layout === 'title' ? (
                        <div className="text-center space-y-4">
                          <h1 className="text-4xl md:text-5xl font-bold">{currentSlide.title}</h1>
                          {currentSlide.content.length > 0 && (
                            <p className="text-xl md:text-2xl opacity-90">{currentSlide.content[0]}</p>
                          )}
                        </div>
                      ) : (
                        <div className="w-full max-w-3xl space-y-6">
                          <h2 className="text-3xl md:text-4xl font-bold">{currentSlide?.title}</h2>
                          <div className="space-y-3">
                            {currentSlide?.content.map((point, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <span className="text-2xl">•</span>
                                <p className="text-lg md:text-xl flex-1">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Slide Number */}
                      <div className="absolute bottom-4 right-4 text-sm opacity-75">
                        {currentSlide?.slideNumber} / {presentation.slides.length}
                      </div>
                    </div>
                  </Card>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={prevSlide}
                      disabled={currentSlideIndex === 0}
                      variant="outline"
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Slide {currentSlideIndex + 1} of {presentation.slides.length}
                    </div>

                    <Button
                      onClick={nextSlide}
                      disabled={currentSlideIndex === presentation.slides.length - 1}
                      variant="outline"
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Slide Thumbnails */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">All Slides</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {presentation.slides.map((slide, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`aspect-video rounded border-2 p-2 text-xs hover:border-primary transition-colors ${
                              idx === currentSlideIndex ? 'border-primary bg-primary/10' : 'border-border'
                            }`}
                          >
                            <div className="font-semibold truncate">{slide.slideNumber}</div>
                            <div className="text-muted-foreground truncate text-[10px]">{slide.title}</div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
