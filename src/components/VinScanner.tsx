import { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { AlertCircle, Camera, CameraOff } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface VinScannerProps {
  onScan: (vin: string) => void;
  onClose: () => void;
  hasCameraPermission: boolean | null;
}

export const VinScanner = ({ onScan, onClose, hasCameraPermission }: VinScannerProps) => {
  const { toast } = useToast();
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const {
    ref,
    torch,
    paused,
    error: scannerError,
  } = useZxing({
    paused: false,
    onDecodeResult(result) {
      const scannedText = result.getText().toUpperCase();
      // Only process if it's a valid VIN
      if (/^[A-HJ-NPR-Z0-9]{17}$/.test(scannedText)) {
        // Provide haptic feedback if supported
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        onScan(scannedText);
        toast({
          title: "VIN Scanned Successfully",
          description: "The VIN has been captured and populated in the form.",
        });
      }
    },
    onError(error) {
      console.error("Scanner error:", error);
      toast({
        variant: "destructive",
        title: "Scanner Error",
        description: "There was an error accessing the camera. Please try again.",
      });
    },
    constraints: {
      video: {
        facingMode: useFrontCamera ? "user" : "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
        aspectRatio: 16/9,
        // Remove focusMode as it's not a valid constraint
        zoom: 1.0,
        brightness: 1.0,
        contrast: 1.0
      }
    }
  });

  // Start camera immediately when component mounts
  useEffect(() => {
    // Camera will start automatically since paused is false
    return () => {
      // Cleanup handled by useZxing
    };
  }, [hasCameraPermission]);

  // Handle torch toggling
  const toggleTorch = async () => {
    try {
      if (torch?.isOn) {
        await torch.off();
      } else {
        await torch?.on();
      }
      setTorchOn(!torchOn);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Torch Error",
        description: "Unable to toggle the torch. Your device might not support this feature.",
      });
    }
  };

  // Handle camera switching
  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  return (
    <DialogContent className="sm:max-w-md p-0">
      <DialogHeader className="p-4">
        <DialogTitle>Scan VIN Barcode</DialogTitle>
      </DialogHeader>
      
      {hasCameraPermission === false ? (
        <div className="p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">
            Camera access is required to scan VIN codes. Please enable it in your browser settings.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Camera View */}
          <div className="relative aspect-[9/16] w-full overflow-hidden">
            <video 
              ref={ref} 
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {/* Scanning Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-4/5 h-24 border-2 border-white/20 rounded-lg">
                {/* Corner Markers */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                </div>
              </div>
            </div>

            {/* Scanning Line Animation */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-primary/75"
              style={{
                animation: "scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                top: "50%"
              }}
            />
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={toggleCamera}
            >
              <Camera className="h-6 w-6" />
            </Button>

            {torch?.isAvailable && (
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={toggleTorch}
              >
                {torchOn ? (
                  <CameraOff className="h-6 w-6" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </DialogContent>
  );
};