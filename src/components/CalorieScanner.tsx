import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type FoodAnalysis = {
  items: string[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  advice: string;
};

const CalorieScanner = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access camera. Please try uploading an image instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setImage(imageData);
        stopCamera();
        analyzeImage(imageData);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { imageBase64: imageData }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnalysis(data.analysis);
      toast.success("Food analyzed successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    stopCamera();
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            📸 Calorie Scanner
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a photo of your meal to get instant calorie and nutrition analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Scan Your Food
              </CardTitle>
              <CardDescription>Use your camera or upload an image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!image && !cameraActive && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={startCamera}
                    className="flex-1"
                    size="lg"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Open Camera
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {cameraActive && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={capturePhoto}
                      className="flex-1"
                      size="lg"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Photo
                    </Button>
                    <Button 
                      onClick={stopCamera}
                      variant="outline"
                      size="lg"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {image && (
                <div className="space-y-6">
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={image} alt="Food" className="w-full h-auto" />
                    <Button
                      onClick={reset}
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}

                  {analysis && !loading && (
                    <div className="space-y-4 bg-secondary/30 p-6 rounded-lg">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">🍽️ Detected Food Items</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {analysis.items.map((item, index) => (
                            <li key={index} className="text-muted-foreground">{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary">{analysis.totalCalories}</div>
                          <div className="text-sm text-muted-foreground">Calories</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary">{analysis.protein}g</div>
                          <div className="text-sm text-muted-foreground">Protein</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary">{analysis.carbs}g</div>
                          <div className="text-sm text-muted-foreground">Carbs</div>
                        </div>
                        <div className="bg-background p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-primary">{analysis.fats}g</div>
                          <div className="text-sm text-muted-foreground">Fats</div>
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">💡 Nutritional Advice</h4>
                        <p className="text-muted-foreground">{analysis.advice}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CalorieScanner;
