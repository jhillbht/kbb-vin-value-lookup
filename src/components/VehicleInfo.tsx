import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CarFront, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { generateVehicleImage, checkGenerationStatus } from "@/lib/replicate";

interface VehicleInfoProps {
  data: {
    make: string;
    model: string;
    year: number;
    trim: string;
    estimatedValue: number;
    tradeInValue: number;
    retailValue: number;
    vin?: string;
  };
}

export const VehicleInfo = ({ data }: VehicleInfoProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSavePDF = () => {
    console.log(`Generating PDF for ${data.year} ${data.make} ${data.model}`);
    
    toast({
      title: "PDF Generated",
      description: "The vehicle valuation PDF has been generated and saved.",
    });
  };

  const handleNotifyTeam = () => {
    const vehicleDetails = `${data.year} ${data.make} ${data.model} ${data.trim}`;
    const recipients = [
      { name: "Manager A", notified: false },
      { name: "Manager B", notified: false },
      { name: "Salesperson A", notified: false }
    ];

    recipients.forEach(recipient => {
      console.log(`Notifying ${recipient.name} about vehicle: ${vehicleDetails}`);
      recipient.notified = true;
    });

    toast({
      title: "Team Notified",
      description: "Vehicle details have been sent to the team members.",
    });
  };

  const handleEmailOffer = () => {
    console.log(`Sending offer email for ${data.year} ${data.make} ${data.model}`);
    
    toast({
      title: "Email Sent",
      description: "The offer has been sent to the customer's email.",
    });
  };

  const generateImage = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Replicate API key to generate images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `${data.year} ${data.make} ${data.model} ${data.trim}`;
      const response = await generateVehicleImage(prompt, apiKey);
      
      // Poll for results
      const pollInterval = setInterval(async () => {
        const result = await checkGenerationStatus(response.urls.get, apiKey);
        
        if (result.status === "succeeded" && result.output) {
          setGeneratedImage(result.output[0]);
          setIsGenerating(false);
          clearInterval(pollInterval);
        } else if (result.status === "failed") {
          toast.error("Failed to generate image");
          setIsGenerating(false);
          clearInterval(pollInterval);
        }
      }, 1000);
      
    } catch (error) {
      setIsGenerating(false);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/50 backdrop-blur-sm border-0">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-64 h-40 bg-muted rounded-lg flex items-center justify-center relative">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt={`${data.year} ${data.make} ${data.model}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  {isGenerating ? (
                    <Loader2 className="w-40 h-40 text-primary animate-spin" />
                  ) : (
                    <CarFront className="w-40 h-40 text-primary" strokeWidth={1.5} />
                  )}
                </>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold mb-1">
                {data.year} {data.make} {data.model} {data.trim}
              </CardTitle>
              {data.vin && (
                <p className="text-sm text-muted-foreground font-mono">
                  VIN: {data.vin}
                </p>
              )}
              <div className="mt-4 space-y-2">
                <Input
                  type="password"
                  placeholder="Enter Replicate API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="max-w-md"
                />
                <Button 
                  onClick={generateImage}
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-green-400 font-medium mb-1">Trade-in Value</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(data.tradeInValue)}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-blue-400 font-medium mb-1">Retail Value</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(data.retailValue)}
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-purple-400 font-medium mb-1">Estimated Value</p>
                <p className="text-2xl font-bold text-purple-400">
                  {formatCurrency(data.estimatedValue)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={handleSavePDF} variant="outline">
                Save PDF
              </Button>
              <Button onClick={handleEmailOffer} variant="outline">
                Email Offer
              </Button>
              <Button onClick={handleNotifyTeam}>
                Notify Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};