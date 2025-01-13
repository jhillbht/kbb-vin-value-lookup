import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ActionButtonsProps {
  onSavePDF: () => void;
  onEmailOffer: () => void;
  onNotifyTeam: () => void;
}

export const ActionButtons = ({ onSavePDF, onEmailOffer, onNotifyTeam }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button onClick={onSavePDF} variant="outline">
        Save PDF
      </Button>
      <Button onClick={onEmailOffer} variant="outline">
        Email Offer
      </Button>
      <Button onClick={onNotifyTeam}>
        Notify Team
      </Button>
    </div>
  );
};