import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface RecentLookup {
  vin: string;
  make: string;
  model: string;
  year: number;
}

interface RecentLookupsProps {
  lookups: RecentLookup[];
  onLookupClick: (vin: string) => void;
}

export const RecentLookups = ({ lookups, onLookupClick }: RecentLookupsProps) => {
  if (lookups.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold">Recent Lookups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {lookups.map((lookup, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors gap-2"
          >
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {lookup.year} {lookup.make} {lookup.model}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {lookup.vin}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto h-10"
              onClick={() => onLookupClick(lookup.vin)}
            >
              Look Up Again
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};