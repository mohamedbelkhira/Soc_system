import React, { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Control } from "react-hook-form";

import { suppliersApi } from "@/api/suppliers.api";
import DateField from "@/components/common/fields/DateField";
import GenericNumberField from "@/components/common/fields/GenericNumberField";
import PreSelectField from "@/components/common/fields/PreSelectField";
import SelectField from "@/components/common/fields/SelectField";
import TextAreaField from "@/components/common/fields/TextAreaField";
import { UpdatePurchaseFullDTO } from "@/types/createPurchase.dto";
import { Supplier } from "@/types/supplier.dto";
import { showToast } from "@/utils/showToast";

interface Props {
  control: Control<UpdatePurchaseFullDTO>;
}

const UpdatePurchaseMetadataForm: React.FC<Props> = ({ control }) => {
  const { setValue, getValues } = useFormContext<UpdatePurchaseFullDTO>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);

  // Track form state and dates
  const state = useWatch({ control, name: "state" });
  const orderedAt = useWatch({ control, name: "orderedAt" });
  const receivedAt = useWatch({ control, name: "receivedAt" });
  const canceledAt = useWatch({ control, name: "canceledAt" });

  // Store original values for reset
  const originalValues = useRef({
    orderedAt: getValues("orderedAt"),
    receivedAt: getValues("receivedAt"),
    canceledAt: getValues("canceledAt"),
  });

  // Fetch suppliers on mount
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
        showToast("error", "Erreur lors de la récupération des fournisseurs");
        console.error(error);
      } finally {
        setIsLoadingSuppliers(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Handle state changes and reset fields
  useEffect(() => {
    // Reset other fields to their original values
    switch (state) {
      case "ORDERED":
        setValue("orderedAt", orderedAt || originalValues.current.orderedAt);
        setValue("receivedAt", undefined);
        setValue("canceledAt", undefined);
        break;
      case "RECEIVED":
        setValue("receivedAt", receivedAt || originalValues.current.receivedAt);
        setValue("orderedAt", undefined);
        setValue("canceledAt", undefined);
        break;
      case "CANCELED":
        setValue("canceledAt", canceledAt || originalValues.current.canceledAt);
        setValue("orderedAt", undefined);
        setValue("receivedAt", undefined);
        break;
      default:
        break;
    }
  }, [state, setValue, orderedAt, receivedAt, canceledAt]);

  if (isLoadingSuppliers) {
    console.log("suppliers", isLoadingSuppliers);
    return <p>Chargement des fournisseurs...</p>;
  }

  const getDateFieldProps = () => {
    switch (state) {
      case "ORDERED":
        return {
          name: "orderedAt",
          label: "Date de commande",
          value: orderedAt,
        };
      case "RECEIVED":
        return {
          name: "receivedAt",
          label: "Date de réception",
          value: receivedAt,
        };
      case "CANCELED":
        return {
          name: "canceledAt",
          label: "Date d'annulation",
          value: canceledAt,
        };
      default:
        return null;
    }
  };

  const dateFieldProps = getDateFieldProps();

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          control={control}
          name="state"
          label="Statut"
          placeholder="Sélectionner le statut"
          options={[
            { value: "ORDERED", label: "Commandé" },
            { value: "RECEIVED", label: "Reçu" },
            { value: "CANCELED", label: "Annulé" },
          ]}
        />
        {dateFieldProps ? (
          <DateField
            key={dateFieldProps.name}
            control={control}
            name={dateFieldProps.name}
            label={dateFieldProps.label}
          />
        ) : (
          <div className="h-0"></div>
        )}
      </div>
      <TextAreaField
        control={control}
        name="description"
        label="Description"
        placeholder="Saisir la description du produit"
      />
      <GenericNumberField
        control={control}
        name="totalAmount"
        label="Montant total"
      />
    </div>
  );
};

export default UpdatePurchaseMetadataForm;
