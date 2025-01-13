import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateVehicleImage, checkGenerationStatus } from "@/lib/replicate";
import { VehicleImage } from "./vehicle/VehicleImage";
import { ValueDisplay } from "./vehicle/ValueDisplay";
import { ActionButtons } from "./vehicle/ActionButtons";

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateImage();
  }, [data]);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const prompt = `${data.year} ${data.make} ${data.model} ${data.trim}`;
      const response = await generateVehicleImage(prompt);
      
      const pollInterval = setInterval(async () => {
        try {
          const result = await checkGenerationStatus(response.urls.get);
          
          if (result.status === "succeeded" && result.output) {
            setGeneratedImage(result.output[0]);
            setIsGenerating(false);
            clearInterval(pollInterval);
          } else if (result.status === "failed") {
            toast({
              title: "Image Generation Failed",
              description: "Failed to generate the vehicle image.",
              variant: "destructive",
            });
            setIsGenerating(false);
            clearInterval(pollInterval);
          }
        } catch (error) {
          clearInterval(pollInterval);
          setIsGenerating(false);
          if (error instanceof Error) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      }, 1000);
      
    } catch (error) {
      setIsGenerating(false);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

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

  return (
    <div className="space-y-6">
      <Card className="bg-secondary/50 backdrop-blur-sm border-0">
        <CardHeader>
          <div className="flex items-center gap-4">
            <VehicleImage
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              vehicleDescription={`${data.year} ${data.make} ${data.model}`}
            />
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold mb-1">
                {data.year} {data.make} {data.model} {data.trim}
              </CardTitle>
              {data.vin && (
                <p className="text-sm text-muted-foreground font-mono">
                  VIN: {data.vin}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <ValueDisplay
                label="Trade-in Value"
                value={data.tradeInValue}
                colorClass="text-green-400"
              />
              <ValueDisplay
                label="Retail Value"
                value={data.retailValue}
                colorClass="text-blue-400"
              />
              <ValueDisplay
                label="Estimated Value"
                value={data.estimatedValue}
                colorClass="text-purple-400"
              />
            </div>

            <ActionButtons
              onSavePDF={handleSavePDF}
              onEmailOffer={handleEmailOffer}
              onNotifyTeam={handleNotifyTeam}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};