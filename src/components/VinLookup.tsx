import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const VinLookup = ({ onSubmit }: { onSubmit: (vin: string) => void }) => {
  const [vin, setVin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic VIN validation (17 characters, alphanumeric)
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      toast.error("Please enter a valid 17-character VIN");
      return;
    }
    
    onSubmit(vin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="vin" className="text-sm font-medium text-gray-700">
          Vehicle Identification Number (VIN)
        </label>
        <Input
          id="vin"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          className="font-mono"
          maxLength={17}
        />
      </div>
      <Button type="submit" className="w-full">
        Look Up Vehicle
      </Button>
    </form>
  );
};