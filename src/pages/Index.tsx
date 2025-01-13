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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vehicle Value Lookup
            </h1>
            <p className="text-lg text-slate-300">
              Enter a VIN to get the latest Kelley Blue Book valuation
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-secondary/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl">
              <VinLookup onSubmit={handleVinSubmit} />
            </div>
            
            {error && (
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 backdrop-blur-sm">
                <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
              </Alert>
            )}
            
            {loading && (
              <div className="flex flex-col items-center justify-center p-12 bg-secondary/30 backdrop-blur-sm rounded-2xl border border-white/10 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-slate-300">Fetching valuation data...</p>
              </div>
            )}
            
            {!loading && vehicleData && (
              <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <VehicleInfo data={vehicleData} />
              </div>
            )}

            {recentLookups.length > 0 && (
              <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                <RecentLookups
                  lookups={recentLookups}
                  onLookupClick={handleVinSubmit}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;