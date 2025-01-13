import { AlertCircle } from "lucide-react";

export const CameraPermissionAlert = () => {
  return (
    <div className="p-6 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
      <p className="text-sm text-muted-foreground">
        Camera access is required to scan VIN codes. Please enable it in your browser settings.
      </p>
    </div>
  );
};