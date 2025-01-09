import { useState } from "react";
import { VinLookup } from "@/components/VinLookup";
import { VehicleInfo } from "@/components/VehicleInfo";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);

  const handleVinSubmit = async (vin: string) => {
    setLoading(true);
    // Simulated API call - replace with actual KBB API integration
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVehicleData({
        make: "Toyota",
        model: "Camry",
        year: 2020,
        trim: "SE",
        estimatedValue: 22500,
      });
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
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
            
            {loading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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