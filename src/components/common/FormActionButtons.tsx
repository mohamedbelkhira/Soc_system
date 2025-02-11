import React from "react";
import { Button } from "@/components/ui/button";
import ButtonGroup from "./ButtonGroup";

interface DialogActionButtonsProps {
  onClose: () => void;
  isSubmitting: boolean;
  cancelLabel?: string;
  submitLabel: string;
  submittingLabel: string;
}

const FormActionButtons: React.FC<DialogActionButtonsProps> = ({
  onClose,
  isSubmitting,
  cancelLabel = "Annuler",
  submitLabel="Créer",
  submittingLabel="Création",
}) => {
  return (
    <div className="flex justify-end">
      <ButtonGroup>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default FormActionButtons;
