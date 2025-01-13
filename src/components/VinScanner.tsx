import { useState } from "react";
import { useZxing } from "react-zxing";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { CameraView } from "./scanner/CameraView";
import { ScannerControls } from "./scanner/ScannerControls";
import { CameraPermissionAlert } from "./scanner/CameraPermissionAlert";

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
  } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText().toUpperCase();
      if (/^[A-HJ-NPR-Z0-9]{17}$/.test(scannedText)) {
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
      }
    }
  });

  const handleToggleTorch = async () => {
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

  const handleToggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  return (
    <DialogContent className="sm:max-w-md p-0">
      <DialogHeader className="p-4">
        <DialogTitle>Scan VIN Barcode</DialogTitle>
      </DialogHeader>
      
      {hasCameraPermission === false ? (
        <CameraPermissionAlert />
      ) : (
        <div className="relative">
          <CameraView videoRef={ref} />
          <ScannerControls
            onToggleCamera={handleToggleCamera}
            onToggleTorch={handleToggleTorch}
            torchAvailable={torch?.isAvailable || false}
            torchOn={torchOn}
          />
        </div>
      )}
    </DialogContent>
  );
};