import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Palette, Upload, RotateCcw, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layouts/AppLayout';
import BackToHome from '@/components/BackToHome';
import { useBackground } from '@/contexts/BackgroundContext';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1920&q=80',
];

const PRESET_GRADIENTS = [
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)' },
  { name: 'Night Sky', value: 'linear-gradient(135deg, #2e1437 0%, #948e99 100%)' },
];

const PRESET_COLORS = [
  { name: 'Dark', value: '#0a0a0a' },
  { name: 'Light', value: '#ffffff' },
  { name: 'Blue', value: '#1e3a8a' },
  { name: 'Purple', value: '#581c87' },
  { name: 'Green', value: '#14532d' },
  { name: 'Red', value: '#7f1d1d' },
];

export default function BackgroundSettingsPage() {
  const { settings, updateSettings, resetSettings } = useBackground();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateSettings({
          type: 'image',
          customImage: imageUrl,
        });
        toast.success('Background image uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetImage = (imageUrl: string) => {
    setSelectedPreset(imageUrl);
    updateSettings({
      type: 'image',
      customImage: imageUrl,
    });
    toast.success('Background applied!');
  };

  const handlePresetGradient = (gradient: string) => {
    setSelectedPreset(gradient);
    updateSettings({
      type: 'image',
      customImage: gradient,
    });
    toast.success('Gradient applied!');
  };

  const handleSolidColor = (color: string) => {
    updateSettings({
      type: 'solid',
      solidColor: color,
    });
    toast.success('Background color applied!');
  };

  const handleReset = () => {
    resetSettings();
    setSelectedPreset(null);
    toast.success('Background reset to default!');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <BackToHome />
        
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Palette className="w-8 h-8 text-primary" />
                  Background Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                  Customize your app background • Changes apply globally
                </p>
              </div>
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset to Default
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Background Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Background Type</CardTitle>
                  <CardDescription>Choose your background style</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={settings.type}
                    onValueChange={(value) => updateSettings({ type: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gradient" id="gradient" />
                      <Label htmlFor="gradient" className="cursor-pointer">
                        Animated Gradient
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="image" />
                      <Label htmlFor="image" className="cursor-pointer">
                        Custom Image
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solid" id="solid" />
                      <Label htmlFor="solid" className="cursor-pointer">
                        Solid Color
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Gradient Settings */}
              {settings.type === 'gradient' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Gradient Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Opacity</Label>
                        <span className="text-sm text-muted-foreground">
                          {settings.gradientOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[settings.gradientOpacity]}
                        onValueChange={([value]) => updateSettings({ gradientOpacity: value })}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upload Custom Image */}
              {settings.type === 'image' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload Image
                    </CardTitle>
                    <CardDescription>Max 10MB • JPG, PNG</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Current Background Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{settings.type}</span>
                  </div>
                  {settings.type === 'gradient' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Opacity:</span>
                      <span className="font-medium">{settings.gradientOpacity}%</span>
                    </div>
                  )}
                  {settings.type === 'image' && settings.customImage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Applied
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Presets Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Preset Images */}
              {settings.type === 'image' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      Preset Images
                    </CardTitle>
                    <CardDescription>Click to apply a preset background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {PRESET_IMAGES.map((imageUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePresetImage(imageUrl)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                            selectedPreset === imageUrl
                              ? 'border-primary ring-2 ring-primary/50'
                              : 'border-border'
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Preset ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preset Gradients */}
              {settings.type === 'image' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Preset Gradients
                    </CardTitle>
                    <CardDescription>Beautiful gradient backgrounds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {PRESET_GRADIENTS.map((gradient, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePresetGradient(gradient.value)}
                          className={`aspect-video rounded-lg border-2 transition-all hover:scale-105 ${
                            selectedPreset === gradient.value
                              ? 'border-primary ring-2 ring-primary/50'
                              : 'border-border'
                          }`}
                          style={{ background: gradient.value }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm drop-shadow-lg">
                              {gradient.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Solid Colors */}
              {settings.type === 'solid' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      Solid Colors
                    </CardTitle>
                    <CardDescription>Choose a solid background color</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {PRESET_COLORS.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSolidColor(color.value)}
                          className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                            settings.solidColor === color.value
                              ? 'border-primary ring-2 ring-primary/50'
                              : 'border-border'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span
                              className={`text-xs font-semibold ${
                                color.value === '#ffffff' ? 'text-black' : 'text-white'
                              }`}
                            >
                              {color.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label>Custom Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={settings.solidColor || '#0a0a0a'}
                          onChange={(e) => handleSolidColor(e.target.value)}
                          className="w-20 h-10 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={settings.solidColor || '#0a0a0a'}
                          onChange={(e) => handleSolidColor(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your background looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="aspect-video rounded-lg border-2 border-border overflow-hidden"
                    style={{
                      backgroundImage:
                        settings.type === 'image' && settings.customImage
                          ? `url(${settings.customImage})`
                          : 'none',
                      backgroundColor:
                        settings.type === 'solid' ? settings.solidColor : 'transparent',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">Qazyene AI</h3>
                        <p className="text-sm opacity-90">Background Preview</p>
                      </div>
                    </div>
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
