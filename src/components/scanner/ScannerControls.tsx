import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface ScannerControlsProps {
  onToggleCamera: () => void;
  onToggleTorch: () => void;
  torchAvailable: boolean;
  torchOn: boolean;
}

export const ScannerControls = ({
  onToggleCamera,
  onToggleTorch,
  torchAvailable,
  torchOn,
}: ScannerControlsProps) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={onToggleCamera}
      >
        <Camera className="h-6 w-6" />
      </Button>

      {torchAvailable && (
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={onToggleTorch}
        >
          {torchOn ? (
            <CameraOff className="h-6 w-6" />
          ) : (
            <Camera className="h-6 w-6" />
          )}
        </Button>
      )}
    </div>
  );
};