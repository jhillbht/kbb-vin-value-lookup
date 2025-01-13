import { CarFront, Loader2 } from "lucide-react";

interface VehicleImageProps {
  generatedImage: string | null;
  isGenerating: boolean;
  vehicleDescription: string;
}

export const VehicleImage = ({ generatedImage, isGenerating, vehicleDescription }: VehicleImageProps) => {
  return (
    <div className="w-64 h-40 bg-muted rounded-lg flex items-center justify-center relative">
      {generatedImage ? (
        <img
          src={generatedImage}
          alt={vehicleDescription}
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
  );
};