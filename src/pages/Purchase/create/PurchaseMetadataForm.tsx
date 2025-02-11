import React, { useState, useEffect } from "react";
import { Control, useController } from "react-hook-form";
import { CreateFullPurchaseDTO } from "@/types/createPurchase.dto";
import { showToast } from "@/utils/showToast";
import { suppliersApi } from "@/api/suppliers.api";
import { Supplier } from "@/types/supplier.dto";
import TextAreaField from "@/components/common/fields/TextAreaField";
import SelectField from "@/components/common/fields/SelectField";
import PreSelectField from "@/components/common/fields/PreSelectField";
import DateField from "@/components/common/fields/DateField";
import GenericNumberField from "@/components/common/fields/GenericNumberField";
// import { CreatePurchaseDTO } from "@/types/purchase.dto";
interface Props {
  control: Control<CreateFullPurchaseDTO>;
}

const PurchaseMetadataForm: React.FC<Props> = ({ control }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
 
  useEffect(() => {
    const fetchSuppliers = async () => {
     
      try {
        const response = await suppliersApi.getAll();
        if (response.status === "success") {
          setSuppliers(response.data);
        } else {
          showToast(
            "error",
            response.message || "Échec du chargement des fournisseurs"
          );
        }
      } catch (error) {
        showToast(
          "error",
          "Erreur lors de la récupération des fournisseurs"
        );
        console.error(error);
      }
    };

    fetchSuppliers();
  }, []);

  const stateField = useController({ name: "state", control });

  return (
    <div className="space-y-6">
      {/* Supplier Selection */}
      <PreSelectField
        control={control}
        name="supplierId"
        label="Fournisseur"
        placeholder="Sélectionner un fournisseur"
        options={suppliers.map((supplier) => ({
          value: supplier.id,
          label: supplier.name,
        }))}
      />

      {/* Status and Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Field */}
        <SelectField
          control={control}
          name="state"
          label="Statut"
          placeholder="Sélectionner le statut"
          options={[
            { value: "ORDERED", label: "Commandé" },
            { value: "RECEIVED", label: "Reçu" },
          ]}
        />

        {/* Date Field */}
        {stateField.field.value ? (
          <DateField
            control={control}
            name={
              stateField.field.value === "ORDERED"
                ? "orderedAt"
                : "receivedAt"
            }
            label={
              stateField.field.value === "ORDERED"
                ? "Date de commande"
                : "Date de réception"
            }
          />
        ) : (
          // Empty div to maintain grid structure
          <div className="h-0"></div>
        )}
      </div>

      {/* Description */}
      <TextAreaField
        control={control}
        name="description"
        label="Description"
        placeholder="Saisir la description du produit"
      />

      {/* Total Amount */}
      <GenericNumberField
       control={control}
        name="totalAmount"
        label="Montant total"
      />
    </div>
  );
};

export default PurchaseMetadataForm;