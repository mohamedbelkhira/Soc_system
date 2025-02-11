import { useCallback, useState } from "react";

import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import NumberField from "@/components/common/fields/NumberField";
import SelectField from "@/components/common/fields/SelectField";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/product.dto";
import { SaleItem } from "@/types/sales/sale-Item.dto";
import SearchableSelectField from "@/components/common/fields/SearchableSelectField";
import { useAddSaleItemForm } from "./useAddSaleItemForm";

export function AddSaleItemDialog({
  locationId,
  products,
  removedSaleItems = [],
  onAdd,
}: {
  locationId: string;
  products: Product[];
  removedSaleItems?: SaleItem[];
  onAdd: (item: SaleItem) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    form,
    selectedProduct,
    handleSubmit,
    productOptions,
    variantOptions,
    maxQuantity,
  } = useAddSaleItemForm({
    locationId,
    products,
    removedSaleItems,
    onAdd: useCallback(
      (item) => {
        onAdd(item);
        setIsOpen(false);
      },
      [onAdd]
    ),
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setIsOpen(isOpen);
      if (!isOpen) {
        // Delay form reset to avoid focus issues
        setTimeout(() => {
          form.reset();
        }, 0);
      }
    },
    [form]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Delay form reset to avoid focus issues
    setTimeout(() => {
      form.reset();
    }, 0);
  }, [form]);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit(handleSubmit)();
    },
    [form, handleSubmit]
  );

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter un article" />}
      title="Ajouter un article"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <SelectField
            key={`product-select-${isOpen}`}
            control={form.control}
            name="productId"
            label="Produit"
            placeholder="Sélectionner un produit"
            options={productOptions}
          />
          {selectedProduct?.hasVariants && (
            
            <SearchableSelectField
            key={`variant-select-${isOpen}`}
            control={form.control}
            name="variantId"
            label="Variante"
            placeholder="Sélectionner une variante"
            options={variantOptions ?? []}
            emptyMessage="Aucune variante trouvée"
          />
          )}
          <NumberField
            control={form.control}
            name="quantity"
            max={maxQuantity}
            label={`Quantité (${maxQuantity})`}
            placeholder="Saisir la quantité"
          />
          <FormActionButtons
            isSubmitting={false}
            onClose={handleClose}
            submitLabel="Ajouter"
            submittingLabel="Ajout..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
