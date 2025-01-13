import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { VinScanner } from "./VinScanner";

interface VinLookupProps {
  onSubmit: (vin: string) => void;
}

export const VinLookup = ({ onSubmit }: VinLookupProps) => {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setHasCameraPermission(false);
        console.error("Camera permission error:", err);
      }
    };

    if (isScannerOpen) {
      checkCameraPermission();
    }
  }, [isScannerOpen]);

  const handleScanClick = async () => {
    setIsScannerOpen(true);
    if (hasCameraPermission === false) {
      toast({
        variant: "destructive",
        title: "Camera Access Required",
        description: "Please enable camera access in your browser settings to scan VIN codes.",
      });
    }
  };

  const handleScan = (scannedVin: string) => {
    setVin(scannedVin);
    setIsScannerOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVinError(null);
    
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      setVinError("Please enter a valid 17-character VIN. VINs can only contain letters (except I, O, Q) and numbers.");
      return;
    }
    
    onSubmit(vin);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="mb-8 w-full max-w-[200px] bg-secondary/50 hover:bg-secondary/70 transition-all duration-300"
        onClick={handleScanClick}
      >
        <Camera className="mr-2 h-5 w-5" />
        Scan VIN
      </Button>

      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
        <div className="space-y-4">
          <label htmlFor="vin" className="block text-lg font-medium text-center text-slate-300">
            Vehicle Identification Number (VIN)
          </label>
          <Input
            id="vin"
            placeholder="Enter 17-character VIN"
            value={vin}
            onChange={(e) => {
              setVin(e.target.value.toUpperCase());
              setVinError(null);
            }}
            className="font-mono h-12 text-lg text-center bg-secondary/50 border-white/10 focus:border-primary/50 focus:ring-primary/50 placeholder:text-slate-500"
            maxLength={17}
          />
        </div>
        
        {vinError && (
          <Alert variant="destructive" className="mt-4 bg-destructive/10 border-destructive/20">
            <AlertDescription className="text-destructive-foreground">{vinError}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-lg mt-8 bg-primary hover:bg-primary/90 transition-all duration-300"
        >
          Get Value
        </Button>
      </form>

      <Dialog 
        open={isScannerOpen} 
        onOpenChange={(open) => setIsScannerOpen(open)}
      >
        <VinScanner
          onScan={handleScan}
          onClose={() => setIsScannerOpen(false)}
          hasCameraPermission={hasCameraPermission}
        />
      </Dialog>
    </div>
  );
};