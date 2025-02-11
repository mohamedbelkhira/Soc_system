// src/components/create-purchase/AppliedPurchaseFeesSection.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/showToast";

const AppliedPurchaseFeesSection = () => {
  const handleAddFee = () => {
    // Future implementation for adding purchase fees
    showToast("info", "Fonctionnalité à venir: Ajouter des frais d'achat");
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Frais d'Achat Appliqués</h2>
        <Button
          type="button"
          onClick={handleAddFee}
          variant="secondary"
        >
          Ajouter un frais d'achat
        </Button>
      </div>
      {/* Placeholder for fees list */}
      <div className="border border-dashed border-gray-300 p-4 rounded-md">
        <p>Les frais d'achat appliqués seront ajoutés ici.</p>
      </div>
    </div>
  );
};

export default AppliedPurchaseFeesSection;
