import { formatCurrency } from "@/lib/utils";

interface ValueDisplayProps {
  label: string;
  value: number;
  colorClass: string;
}

export const ValueDisplay = ({ label, value, colorClass }: ValueDisplayProps) => {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <p className={`text-sm ${colorClass} font-medium mb-1`}>{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
};