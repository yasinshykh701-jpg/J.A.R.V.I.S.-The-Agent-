import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Image as ImageIcon, Upload, Download, Sparkles, Wand2, History as HistoryIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import { aiApi } from '@/db/api';
import BackToHome from '@/components/BackToHome';

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      if (uploadedImagePreview) {
        // Image-to-image generation
        toast.info('Generating image with reference... This may take 1-2 minutes');
        
        const { image_urls, success_count } = await aiApi.generateImageFromImage(
          prompt, 
          uploadedImagePreview,
          uploadedImagePreview.startsWith('data:image/png') ? 'image/png' : 
          uploadedImagePreview.startsWith('data:image/jpeg') ? 'image/jpeg' : 
          uploadedImagePreview.startsWith('data:image/webp') ? 'image/webp' : 'image/png'
        );
        
        if (success_count > 0 && image_urls.length > 0) {
          setGeneratedImage(image_urls[0]);
          setHistory(prev => [image_urls[0], ...prev].slice(0, 10));
          toast.success('Image generated successfully!');
        } else {
          throw new Error('No images were generated');
        }
      } else {
        // Text-to-image generation
        toast.info('Generating image from text... This may take 1-2 minutes');
        
        const { image_urls, success_count } = await aiApi.generateImage(prompt, '1:1', 1);
        
        if (success_count > 0 && image_urls.length > 0) {
          setGeneratedImage(image_urls[0]);
          setHistory(prev => [image_urls[0], ...prev].slice(0, 10));
          toast.success('Image generated successfully!');
        } else {
          throw new Error('No images were generated');
        }
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast.error(error.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `qazyen-gen-${Date.now()}.png`;
      link.click();
      toast.success('Image saved to downloads');
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#F2F2F7] dark:bg-[#000000]">
        <div className="ios-blur border-b border-border/50 ios-shadow z-10 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsate0bsqgw.jpg)]">
          <div className="content-column py-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Image Studio</h1>
              <p className="text-[13px] font-medium uppercase tracking-wider text-[#f3e5e5]">Creative Generation by Qazyen AI</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="content-column py-10 border-solid border-[rgb(218,231,231)] bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agseasf1i3nk.jpg)] rounded-[20px] border-[5px] mr-[0px] ml-[0px] mt-[15px] border-[rgb(218,231,231)]">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Controls Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="ios-card p-6 ios-shadow bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsdmo9fy4u8.jpg)]">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-primary" />
                    Creative Prompt
                  </h2>
                  
                  <div className="space-y-6 bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agseasf1i3nk.jpg)] rounded-[20px] border-[5px] border-solid border-[rgb(218,231,231)]">
                    <div>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe what you want Qazyen AI to create..."
                        className="ios-input min-h-[160px] max-h-[300px] resize-none py-4 text-sm font-medium leading-relaxed bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agschgi78cg0.jpg)]"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Reference (Optional)</h3>
                      <div className="relative border-2 border-dashed border-border rounded-3xl p-4 transition-all hover:bg-muted/30">
                        {uploadedImagePreview ? (
                          <div className="relative group aspect-video rounded-2xl overflow-hidden shadow-md">
                            <img src={uploadedImagePreview} alt="Ref" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setUploadedImagePreview(null)}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center py-6 cursor-pointer group">
                            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary">Add Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading || !prompt.trim()}
                      className="w-full ios-button h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
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
                  </div>
                </div>

                {history.length > 0 && (
                  <div className="ios-card p-6 border-none">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <HistoryIcon className="w-4 h-4 text-muted-foreground" />
                      Recent History
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {history.slice(0, 4).map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm hover:ring-2 ring-primary/50 transition-all cursor-pointer" onClick={() => setGeneratedImage(img)}>
                          <img src={img} alt="History" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Display Column */}
              <div className="lg:col-span-3">
                <div className="ios-card aspect-square dark:bg-[#1A1A1A] flex items-center justify-center overflow-hidden border-none shadow-2xl relative bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsbbd6gq134.jpg)]">
                  {isLoading ? (
                    <div className="text-center animate-in zoom-in duration-500">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">Q</div>
                      </div>
                      <p className="text-lg font-bold">Creating with Qazyen AI...</p>
                      <p className="text-sm text-muted-foreground mt-1">This usually takes 15-30 seconds</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="w-full h-full relative group animate-in fade-in duration-1000">
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          onClick={handleDownload}
                          size="lg"
                          className="ios-button bg-white text-black hover:bg-white/90 shadow-xl"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground animate-in fade-in duration-700">
                      <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://miaoda-edit-image.s3cdn.medo.dev/8sm6282ej0n5/IMG-agsb5nz910xs.jpg)]">
                        <ImageIcon className="w-10 h-10 opacity-30" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Awaiting Creativity</h3>
                      <p className="max-w-xs mx-auto font-medium">Describe your vision on the left, and Qazyen AI will bring it to life here.</p>
                    </div>
                  )}
                </div>

                {generatedImage && !isLoading && (
                  <div className="mt-6 flex justify-center gap-4">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="ios-button h-12 border-border/50 hover:bg-muted/50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save Image
                    </Button>
                    <Button
                      onClick={() => {
                        setPrompt('');
                        setGeneratedImage(null);
                      }}
                      variant="ghost"
                      className="ios-button h-12 text-muted-foreground"
                    >
                      New Generation
                    </Button>
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
