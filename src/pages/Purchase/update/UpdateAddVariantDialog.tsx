import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import GenericNumberField from "@/components/common/fields/GenericNumberField";
import GenericSelectField from "@/components/common/fields/GenericSelectField";
import MultiSelectField from "@/components/common/fields/MultiSelectField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useProducts } from "@/swr/products/product.swr";
import { useProductVariants } from "@/swr/products/variant.swr";
import { Variant } from "@/types/variant.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

interface VariantItem {
  variant: Variant;
  quantity: number;
  unitCost: number;
  variantId: string;
}

const addVariantSchema = z.object({
  productId: z
    .string()
    .min(1, "Sélectionnez au moins un produit")
    .uuid("l'id du produit est faux"),
  variantIds: z
    .array(z.string().uuid("l'ID du variant est faux"))
    .min(1, "Sélectionnez au moins une variante"),
  quantity: z.number().min(1, "La quantité doit etre superieur à 0"),
  unitCost: z.number().min(0, "Le coût unitaire doit étre positif"),
});

export function UpdateAddVariantDialog({
  onAdd,
}: {
  onAdd?: (variants: VariantItem[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [hasVariants, setHasVariants] = useState<boolean>(true);

  const emptyParams = new URLSearchParams();
  const { data: productsData } = useProducts(emptyParams);
  const products = productsData ?? [];

  const form = useForm<z.infer<typeof addVariantSchema>>({
    resolver: zodResolver(addVariantSchema),
    defaultValues: {
      productId: "",
      variantIds: [],
      quantity: 0,
      unitCost: 0,
    },
  });

  const variantParams = new URLSearchParams();
  variantParams.set("page", "1");
  variantParams.set("limit", "100");
  if (selectedProduct) {
    variantParams.set("productId", selectedProduct);
  }

  const { data: variantsData, isLoading: isVariantsLoading } =
    useProductVariants(selectedProduct, variantParams);

  const variants = variantsData ?? [];

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const resetForm = () => {
    form.reset({
      productId: "",
      variantIds: [],
      quantity: 0,
      unitCost: 0,
    });
    setSelectedProduct("");
    setHasVariants(true);
    setIsSubmitting(false);
  };

  const handleProductChange = (productId: string) => {
    const selectedProductData = products.find(p => p.id === productId);
    setHasVariants(selectedProductData?.hasVariants ?? true);
    setSelectedProduct(productId);
    form.setValue("variantIds", []);
  };

  useEffect(() => {
    if (!selectedProduct) {
      form.setValue("variantIds", []);
      setHasVariants(true);
      return;
    }

    // If product doesn't have variants, auto-select the default variant
    if (!hasVariants && variants[0]) {
      form.setValue("variantIds", [variants[0].id]);
    }
  }, [variants, form, selectedProduct, hasVariants]);

  const onSubmit = async (values: z.infer<typeof addVariantSchema>) => {
    setIsSubmitting(true);
    try {
      const selectedVariants = variants.filter((variant) =>
        values.variantIds.includes(variant.id)
      );

      if (selectedVariants.length > 0) {
        const newVariantsData = selectedVariants.map((variant) => ({
          ...values,
          variant,
          variantId: variant.id,
        }));
        setIsOpen(false);
        resetForm();
        onAdd?.(newVariantsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter des Variantes" />}
      title="Ajouter de nouvelles variantes"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <GenericSelectField
              control={form.control}
              label="Produit"
              placeholder="Sélectionner un produit"
              options={products.map((product) => ({
                value: product.id,
                label: `${product.name} - ${product.brand}`,
              }))}
              {...field}
              onSelectChange={(e) => {
                field.onChange(e);
                handleProductChange(e);
              }}
            />
          )}
        />

        <div className="mt-5"></div>
        
        {/* Only show MultiSelectField if product has variants */}
        {hasVariants && (
          <FormField
            control={form.control}
            name="variantIds"
            render={({ field }) => (
              <MultiSelectField
                control={form.control}
                label="Variantes"
                placeholder={
                  !selectedProduct
                    ? "Sélectionnez d'abord un produit"
                    : isVariantsLoading
                    ? "Chargement des variantes..."
                    : "Sélectionner des variantes"
                }
                options={variants.map((variant) => ({
                  value: variant.id,
                  label: variant.attributeValues
                    .map((attr) => attr.value)
                    .join(" - ")
                }))}
                disabled={!selectedProduct}
                {...field}
              />
            )}
          />
        )}

        <div className="mt-5"></div>
        <GenericNumberField
          control={form.control}
          name="quantity"
          label="Quantité"
        />

        <div className="mt-5"></div>
        <GenericNumberField
          control={form.control}
          name="unitCost"
          label="Coût Unitaire"
        />

        <div className="flex justify-end gap-2 mt-10">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isSubmitting ? "Ajout..." : "Ajouter"}
          </Button>
        </div>
      </Form>
    </CustomDialog>
  );
}

export default UpdateAddVariantDialog;


