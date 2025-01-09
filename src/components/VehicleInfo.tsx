import { Card } from "@/components/ui/card";

interface VehicleData {
  make: string;
  model: string;
  year: number;
  trim: string;
  estimatedValue: number;
}

export const VehicleInfo = ({ data }: { data: VehicleData }) => {
  return (
    <Card className="p-6 w-full max-w-md">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {data.year} {data.make} {data.model}
          </h2>
          <p className="text-gray-500">{data.trim}</p>
        </div>
        
        <div className="pt-4 border-t">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Estimated Value</p>
            <p className="text-3xl font-bold text-primary">
              ${data.estimatedValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};