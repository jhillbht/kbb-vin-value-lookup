import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ScanButtonProps {
  onClick: () => void;
}

export const ScanButton = ({ onClick }: ScanButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="mb-8 w-full max-w-[200px] bg-secondary/50 hover:bg-secondary/70 transition-all duration-300"
      onClick={onClick}
    >
      <Camera className="mr-2 h-5 w-5" />
      Scan VIN
    </Button>
  );
};