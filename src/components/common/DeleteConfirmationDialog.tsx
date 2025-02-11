import { ReactNode, useState } from "react";

import { Button } from "../ui/button";
import CustomDialog from "./CustomDialog";
import DeleteAction from "./actions/DeleteAction";

export default function DeleteConfirmationDialog({
  trigger = <DeleteAction />,
  title,
  description,
  isDeleting,
  onConfirm,
}: {
  trigger?: ReactNode;
  title: string;
  description: string;
  isDeleting: boolean;
  onConfirm: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CustomDialog
      trigger={trigger}
      title={title}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="space-y-4">
        <p>
          {description} <br /> Cette action est irréversible.
        </p>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
}
