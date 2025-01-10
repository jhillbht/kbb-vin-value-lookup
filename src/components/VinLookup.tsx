import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const VinLookup = ({ onSubmit }: { onSubmit: (vin: string) => void }) => {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState<string | null>(null);

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
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-4">
        <div className="space-y-3">
          <label htmlFor="vin" className="block text-sm sm:text-base font-medium text-center">
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
            className="font-mono h-12 sm:h-10 text-base sm:text-sm text-center"
            maxLength={17}
          />
        </div>
        
        {vinError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{vinError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full h-12 sm:h-10 text-base sm:text-sm mt-6">
          Get Value
        </Button>
      </form>
    </div>
  );
};