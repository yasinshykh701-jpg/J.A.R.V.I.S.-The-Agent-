import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Globe, 
  Mic, 
  MessageSquare, 
  Image as ImageIcon,
  Video,
  Infinity,
  AlertCircle
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import DataResetPanel from '@/components/DataResetPanel';
import { freeAI } from '@/services/lifetimeFreeAI';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [serviceStatus, setServiceStatus] = useState<any>(null);

  useEffect(() => {
    const status = freeAI.getServiceStatus();
    setServiceStatus(status);
  }, []);

  const freeServices = [
    {
      icon: Mic,
      name: 'Text-to-Speech',
      description: 'Browser native voice synthesis with 50+ languages',
      status: serviceStatus?.tts?.available ? 'Active' : 'Unavailable',
      type: 'Browser Native',
      color: 'text-blue-500',
      features: ['50+ Languages', 'Adjustable Speed', 'Multiple Voices', 'Offline Support']
    },
    {
      icon: MessageSquare,
      name: 'Speech-to-Text',
      description: 'Browser native voice recognition with real-time transcription',
      status: serviceStatus?.stt?.available ? 'Active' : 'Unavailable',
      type: 'Browser Native',
      color: 'text-green-500',
      features: ['Real-time', 'Continuous Mode', 'High Accuracy', 'Offline Support']
    },
    {
      icon: ImageIcon,
      name: 'Image Generation',
      description: 'Pollinations AI + Hugging Face Stable Diffusion',
      status: 'Active',
      type: 'Free Cloud APIs',
      color: 'text-purple-500',
      features: ['High Quality', 'Multiple Models', 'Fast Generation', 'Fallback Support']
    },
    {
      icon: MessageSquare,
      name: 'Chat/LLM',
      description: 'Hugging Face DialoGPT + GPT-2 with intelligent fallbacks',
      status: 'Active',
      type: 'Free Cloud APIs',
      color: 'text-orange-500',
      features: ['Natural Conversation', 'Context Aware', 'Streaming', 'Multiple Models']
    },
    {
      icon: Video,
      name: 'Video Generation',
      description: 'Canvas-based high-quality video preview generation',
      status: 'Active',
      type: 'Client-side',
      color: 'text-pink-500',
      features: ['Instant Generation', 'HD Quality', 'Customizable', 'No API Calls']
    }
  ];

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Settings & Services
          </h1>
          <p className="text-[#fffbfb]">
            Manage your AI services and application data
          </p>
        </div>

        {/* Lifetime Free Badge */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-solid border-[rgba(255,255,255,0.2)] border-[10.8108px] border-[#ffffff]">
          <CardContent className="pt-6 border-solid border-[#8e4c4c33] border-[0px] rounded-[10px] border-[#8e4c4c33]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Infinity className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-[#f2e7e7]">Lifetime Free & Unlimited</h2>
                </div>
                <p className="text-[#faf5f5]">
                  All AI services are completely free with no usage limits
                </p>
              </div>
              <Badge variant="default" className="text-lg px-4 py-2">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">
              <Zap className="w-4 h-4 mr-2" />
              AI Services
            </TabsTrigger>
            <TabsTrigger value="data">
              <Globe className="w-4 h-4 mr-2" />
              Data Management
            </TabsTrigger>
          </TabsList>

          {/* AI Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Free AI Services</CardTitle>
                <CardDescription>
                  All services are active and ready to use without any API keys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 bg-cover bg-center bg-no-repeat bg-[#f7f7f74a]">
                  {freeServices.map((service, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-muted ${service.color}`}>
                            <service.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{service.name}</h3>
                              <Badge 
                                variant="outline" 
                                className={service.status === 'Active' 
                                  ? 'text-green-500 border-green-500' 
                                  : 'text-orange-500 border-orange-500'
                                }
                              >
                                {service.status === 'Active' ? (
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                )}
                                {service.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {service.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <Infinity className="w-3 h-3 mr-1" />
                                Unlimited
                              </Badge>
                            </div>
                            {service.features && (
                              <div className="pt-2">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Features:</p>
                                <div className="flex flex-wrap gap-1">
                                  {service.features.map((feature, idx) => (
                                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Service Info */}
                <div className="mt-6 p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Service Features & Benefits
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        No API keys required
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        No usage limits or quotas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        100% free forever
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        No credit card required
                      </li>
                    </ul>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        Works in all modern browsers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        Multiple fallback options
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        High-quality output
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        Privacy-focused (no tracking)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <DataResetPanel />
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-500">How Our Free Services Work</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Browser Native Services:</strong> Text-to-Speech and Speech-to-Text use your browser's built-in Web Speech API. These services work completely offline, require no API calls, and have unlimited usage.
                  </p>
                  <p>
                    <strong className="text-foreground">Free Cloud APIs:</strong> Image generation uses Pollinations AI (primary) and Hugging Face Stable Diffusion (fallback). Chat uses Hugging Face's DialoGPT and GPT-2 models. All are free-tier services with no API keys required.
                  </p>
                  <p>
                    <strong className="text-foreground">Client-side Generation:</strong> Video generation uses HTML5 Canvas to create high-quality previews instantly on your device with no external API calls.
                  </p>
                  <p className="pt-2 border-t border-border">
                    <strong className="text-foreground">Multiple Fallbacks:</strong> Each service has intelligent fallback mechanisms to ensure reliability. If one API is unavailable, the system automatically tries alternatives or generates high-quality placeholders.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
