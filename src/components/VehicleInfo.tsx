import { Card } from "@/components/ui/card";

interface VehicleData {
  make: string;
  model: string;
  year: number;
  trim: string;
  estimatedValue: number;
  tradeInValue?: number;
  retailValue?: number;
  cpoValue?: number;
}

export const VehicleInfo = ({ data }: { data: VehicleData }) => {
  return (
    <Card className="p-6 w-full max-w-md">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {data.year} {data.make} {data.model}
          </h2>
          <p className="text-gray-500">{data.trim}</p>
        </div>
        
        <div className="grid gap-4">
          <div className="p-4 rounded-lg bg-green-50">
            <p className="text-sm font-medium text-green-800">Trade-in Value</p>
            <p className="text-2xl font-bold text-green-700">
              ${data.tradeInValue?.toLocaleString() ?? data.estimatedValue.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm font-medium text-blue-800">Retail Value</p>
            <p className="text-2xl font-bold text-blue-700">
              ${data.retailValue?.toLocaleString() ?? (data.estimatedValue * 1.2).toLocaleString()}
            </p>
          </div>

          {data.cpoValue && (
            <div className="p-4 rounded-lg bg-purple-50">
              <p className="text-sm font-medium text-purple-800">Certified Pre-Owned Value</p>
              <p className="text-2xl font-bold text-purple-700">
                ${data.cpoValue.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};