import { useState } from "react";
import { VinLookup } from "@/components/VinLookup";
import { VehicleInfo } from "@/components/VehicleInfo";
import { RecentLookups } from "@/components/RecentLookups";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getVehicleValuation } from "@/lib/kbb-api";

interface RecentLookup {
  vin: string;
  make: string;
  model: string;
  year: number;
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentLookups, setRecentLookups] = useState<RecentLookup[]>([]);

  const addToRecentLookups = (vin: string, data: any) => {
    setRecentLookups((prev) => {
      const newLookup = {
        vin,
        make: data.make,
        model: data.model,
        year: data.year,
      };
      
      const filtered = prev.filter((lookup) => lookup.vin !== vin);
      return [newLookup, ...filtered].slice(0, 5);
    });
  };

  const handleVinSubmit = async (vin: string) => {
    setLoading(true);
    setError(null);
    setVehicleData(null);

    try {
      const data = await getVehicleValuation(vin);
      setVehicleData(data);
      addToRecentLookups(vin, data);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
              Vehicle Value Lookup
            </h1>
            <p className="text-muted-foreground">
              Enter a VIN to get the latest Kelley Blue Book valuation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 rounded-lg">
                <VinLookup onSubmit={handleVinSubmit} />
              </div>
              
              {error && (
                <Alert variant="destructive" className="glass-card border-destructive/20">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {loading && (
                <div className="flex flex-col items-center justify-center p-12 glass-card rounded-lg space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Fetching valuation data...</p>
                </div>
              )}
              
              {!loading && vehicleData && (
                <div className="glass-card rounded-lg">
                  <VehicleInfo data={vehicleData} />
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="glass-card rounded-lg">
                <RecentLookups
                  lookups={recentLookups}
                  onLookupClick={handleVinSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;