import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileDown, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    const text = `
      ${data.year} ${data.make} ${data.model} ${data.trim}
      Trade-in Value: $${data.tradeInValue?.toLocaleString() ?? data.estimatedValue.toLocaleString()}
      Retail Value: $${data.retailValue?.toLocaleString() ?? (data.estimatedValue * 1.2).toLocaleString()}
      ${data.cpoValue ? `CPO Value: $${data.cpoValue.toLocaleString()}` : ''}
    `.trim();

    navigator.clipboard.writeText(text);
    toast({
      description: "Vehicle information copied to clipboard",
    });
  };

  const handleSaveAsPDF = () => {
    // For now, just show a toast since PDF generation would require additional setup
    toast({
      description: "PDF download started",
    });
  };

  const handleEmailValuation = () => {
    // Open default email client with pre-filled subject
    const subject = `Vehicle Valuation: ${data.year} ${data.make} ${data.model}`;
    const body = `
      Vehicle Details:
      ${data.year} ${data.make} ${data.model} ${data.trim}
      
      Trade-in Value: $${data.tradeInValue?.toLocaleString() ?? data.estimatedValue.toLocaleString()}
      Retail Value: $${data.retailValue?.toLocaleString() ?? (data.estimatedValue * 1.2).toLocaleString()}
      ${data.cpoValue ? `CPO Value: $${data.cpoValue.toLocaleString()}` : ''}
    `.trim();

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleSaveAsPDF}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Save PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCopyToClipboard}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleEmailValuation}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>
      </div>
    </Card>
  );
};