import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { VinScanner } from "./VinScanner";
import { ScanButton } from "./vin/ScanButton";
import { VinInputForm } from "./vin/VinInputForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface VinLookupProps {
  onSubmit: (vin: string) => void;
}

export const VinLookup = ({ onSubmit }: VinLookupProps) => {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
      // Only stop the stream if we're not immediately opening the scanner
      if (!isScannerOpen) {
        stream.getTracks().forEach(track => track.stop());
      }
      return stream;
    } catch (err) {
      setHasCameraPermission(false);
      console.error("Camera permission error:", err);
      return null;
    }
  };

  const handleScanClick = async () => {
    // For mobile devices, check camera permission before opening the scanner
    if (isMobile) {
      const stream = await checkCameraPermission();
      if (stream) {
        setIsScannerOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Camera Access Required",
          description: "Please enable camera access in your browser settings to scan VIN codes.",
        });
      }
    } else {
      setIsScannerOpen(true);
      checkCameraPermission();
    }
  };

  const handleScan = (scannedVin: string) => {
    setVin(scannedVin);
    setIsScannerOpen(false);
  };

  const handleVinChange = (value: string) => {
    setVin(value);
    setVinError(null);
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
      <ScanButton onClick={handleScanClick} />
      
      <VinInputForm
        vin={vin}
        onVinChange={handleVinChange}
        onSubmit={handleSubmit}
        error={vinError}
      />

      <Dialog 
        open={isScannerOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsScannerOpen(false);
          }
        }}
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