import { useState } from "react";
import { VinLookup } from "@/components/VinLookup";
import { VehicleInfo } from "@/components/VehicleInfo";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVinSubmit = async (vin: string) => {
    setLoading(true);
    setError(null);
    setVehicleData(null);

    // Simulated API call - replace with actual KBB API integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const data = {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        trim: "SE",
        estimatedValue: 22500,
        tradeInValue: 20000,
        retailValue: 24500,
        cpoValue: 26000,
      };

      // Simulate validation of required fields
      if (!data.make || !data.model || !data.year || !data.estimatedValue) {
        throw new Error("The vehicle information is incomplete. Please try a different VIN.");
      }

      setVehicleData(data);
    } catch (error) {
      let errorMessage = "An unexpected error occurred while fetching vehicle data.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (!window.navigator.onLine) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              KBB Valuation Lookup
            </h1>
            <p className="text-gray-600">
              Enter a VIN to get the latest Kelley Blue Book valuation
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <VinLookup onSubmit={handleVinSubmit} />
            
            {error && (
              <Alert variant="destructive" className="w-full max-w-md">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {loading && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-gray-600">Fetching KBB valuation...</p>
              </div>
            )}
            
            {!loading && vehicleData && <VehicleInfo data={vehicleData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;