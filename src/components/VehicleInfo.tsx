import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface VehicleInfoProps {
  data: {
    vin: string;
    year: number;
    make: string;
    model: string;
    trim: string;
    mileage: number;
    condition: string;
    valuations: {
      retail: number;
      privateParty: number;
      tradeIn: number;
    };
  };
}

export const VehicleInfo = ({ data }: VehicleInfoProps) => {
  const { toast } = useToast();

  const handleSavePDF = () => {
    // PDF generation logic
  };

  const handleNotifyTeam = () => {
    const vehicleDetails = `${data.year} ${data.make} ${data.model} ${data.trim} (VIN: ${data.vin})`;
    const recipients = [
      { name: "Manager A", notified: false },
      { name: "Manager B", notified: false },
      { name: "Salesperson A", notified: false }
    ];

    // Simulate sending notifications
    recipients.forEach(recipient => {
      // In a real implementation, this would make API calls to your notification system
      console.log(`Notifying ${recipient.name} about vehicle: ${vehicleDetails}`);
      recipient.notified = true;
    });

    // Show success toast
    toast({
      title: "Team Notified",
      description: "Vehicle details have been sent to the team members.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {data.year} {data.make} {data.model} {data.trim}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">VIN</p>
                <p className="font-mono">{data.vin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p>{data.mileage.toLocaleString()} miles</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="capitalize">{data.condition}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Valuations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Retail</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(data.valuations.retail)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Private Party</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(data.valuations.privateParty)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Trade-In</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(data.valuations.tradeIn)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button onClick={handleSavePDF} variant="outline">
                Save PDF
              </Button>
              <Button onClick={handleNotifyTeam}>
                Notify Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
