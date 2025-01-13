import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VinInputFormProps {
  vin: string;
  onVinChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

export const VinInputForm = ({ vin, onVinChange, onSubmit, error }: VinInputFormProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <label htmlFor="vin" className="block text-lg font-medium text-center text-slate-300">
          Vehicle Identification Number (VIN)
        </label>
        <Input
          id="vin"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => onVinChange(e.target.value.toUpperCase())}
          className="font-mono h-12 text-lg text-center bg-secondary/50 border-white/10 focus:border-primary/50 focus:ring-primary/50 placeholder:text-slate-500"
          maxLength={17}
        />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-4 bg-destructive/10 border-destructive/20">
          <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full h-12 text-lg mt-8 bg-primary hover:bg-primary/90 transition-all duration-300"
      >
        Get Value
      </Button>
    </form>
  );
};