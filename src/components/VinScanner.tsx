import { useEffect } from "react";
import { useZxing } from "react-zxing";
import { AlertCircle } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface VinScannerProps {
  onScan: (vin: string) => void;
  onClose: () => void;
  hasCameraPermission: boolean | null;
}

export const VinScanner = ({ onScan, onClose, hasCameraPermission }: VinScannerProps) => {
  const { toast } = useToast();

  const {
    ref,
    torch,
    isStarted,
    stop,
    start,
    error: scannerError
  } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText().toUpperCase();
      if (/^[A-HJ-NPR-Z0-9]{17}$/.test(scannedText)) {
        onScan(scannedText);
        toast({
          title: "VIN Scanned Successfully",
          description: "The VIN has been captured and populated in the form.",
        });
      }
    },
    onError(error) {
      console.error("Scanner error:", error);
    },
    constraints: {
      video: {
        facingMode: { exact: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        aspectRatio: 16/9
      }
    },
  });

  useEffect(() => {
    if (!isStarted) {
      start();
    }
    return () => {
      if (isStarted) {
        stop();
      }
    };
  }, [isStarted, start, stop]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Scan VIN Barcode</DialogTitle>
      </DialogHeader>
      {hasCameraPermission === false ? (
        <div className="p-4 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">
            Camera access is required to scan VIN codes. Please enable it in your browser settings.
          </p>
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <video 
            ref={ref} 
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            playsInline
            muted
          />
        </div>
      )}
    </DialogContent>
  );
};