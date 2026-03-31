import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Presentation, Download, Plus, Trash2, Image, Type, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';

interface Slide {
  id: string;
  title: string;
  content: string;
  layout: 'title' | 'content' | 'image' | 'two-column';
}

export default function PPTMakerPage() {
  const [presentationTitle, setPresentationTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', title: 'Title Slide', content: '', layout: 'title' }
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [theme, setTheme] = useState('professional');

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: `Slide ${slides.length + 1}`,
      content: '',
      layout: 'content'
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    toast.success('New slide added');
  };

  const deleteSlide = (index: number) => {
    if (slides.length === 1) {
      toast.error('Cannot delete the last slide');
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
    toast.success('Slide deleted');
  };

  const updateSlide = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const generatePresentation = () => {
    if (!presentationTitle.trim()) {
      toast.error('Please enter a presentation title');
      return;
    }
    toast.success('Generating presentation... (Feature coming soon)');
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <div className="ios-blur border-b border-border/50 ios-shadow z-10 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agunxswdglxc.jpg)]">
          <div className="content-column py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Presentation className="w-6 h-6 text-primary" />
                PPT Maker
              </h1>
              <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-wider">
                Create Professional Presentations
              </p>
            </div>
            <Button
              onClick={generatePresentation}
              className="ios-button hover:bg-primary/90 text-primary-foreground bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aguv2ax0l1q8.jpg)]"
            >
              <Download className="w-4 h-4 mr-2" />
              Generate PPT
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Slide List Sidebar */}
          <div className="w-64 border-r border-border/50 ios-blur p-4 overflow-y-auto bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aguvl5nnbqww.jpg)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Slides ({slides.length})
                </h3>
                <Button
                  size="sm"
                  onClick={addSlide}
                  className="ios-button h-8 w-8 p-0 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aguve53ox2ps.jpg)]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {slides.map((slide, index) => (
                <Card
                  key={slide.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentSlideIndex === index
                      ? 'ring-2 ring-primary shadow-lg'
                      : ''
                  }`}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-muted-foreground">
                          Slide {index + 1}
                        </p>
                        <p className="text-sm font-semibold truncate mt-1">
                          {slide.title || 'Untitled'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSlide(index);
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 overflow-y-auto p-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-aguuoplcn37k.jpg)]">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Presentation Settings */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Presentation Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your presentation details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Presentation Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter presentation title..."
                      value={presentationTitle}
                      onChange={(e) => setPresentationTitle(e.target.value)}
                      className="ios-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger id="theme" className="ios-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Current Slide Editor */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5 text-primary" />
                    Slide {currentSlideIndex + 1} Editor
                  </CardTitle>
                  <CardDescription>
                    Edit your slide content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slide-title">Slide Title</Label>
                    <Input
                      id="slide-title"
                      placeholder="Enter slide title..."
                      value={currentSlide.title}
                      onChange={(e) =>
                        updateSlide(currentSlideIndex, 'title', e.target.value)
                      }
                      className="ios-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slide-layout">Layout</Label>
                    <Select
                      value={currentSlide.layout}
                      onValueChange={(value) =>
                        updateSlide(currentSlideIndex, 'layout', value)
                      }
                    >
                      <SelectTrigger id="slide-layout" className="ios-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title Slide</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="two-column">Two Column</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slide-content">Content</Label>
                    <Textarea
                      id="slide-content"
                      placeholder="Enter slide content..."
                      value={currentSlide.content}
                      onChange={(e) =>
                        updateSlide(currentSlideIndex, 'content', e.target.value)
                      }
                      className="ios-input min-h-[200px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-border/50 p-8 flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-bold mb-4 text-center">
                      {currentSlide.title || 'Untitled Slide'}
                    </h2>
                    <p className="text-muted-foreground text-center whitespace-pre-wrap">
                      {currentSlide.content || 'No content yet...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
