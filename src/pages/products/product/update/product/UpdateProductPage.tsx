import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormActionButtons from "@/components/common/FormActionButtons";
import NumberField from "@/components/common/fields/NumberField";
import SelectField from "@/components/common/fields/SelectField";
import TextAreaField from "@/components/common/fields/TextAreaField";
import TextField from "@/components/common/fields/TextField";
import ToggleField from "@/components/common/fields/ToggleField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/config/environment";
import { useActiveCategories } from "@/swr/products/category.swr";
import handleError from "@/utils/handleError";

import { ProductImagesUploader } from "../../shared/ProductImagesUploader";
import { useUpdateProductForm } from "./useUpdateProductForm";

export default function UpdateProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: categories, error: categoriesError } = useActiveCategories();

  const {
    form,
    imageState,
    isLoading,
    isFetching,
    onSubmit,
    handleImageChange,
    handleRemoveExistingImage,
  } = useUpdateProductForm(id!, () => {
    navigate("/products");
  });

  useEffect(() => {
    if (categoriesError) {
      handleError(categoriesError, "Échec lors du chargement des catégories");
    }
  }, [categoriesError]);

  if (isFetching) {
    return <Skeleton className="h-[500px]" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mettre à jour le produit</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                control={form.control}
                name="name"
                label="Nom du Produit"
                placeholder="Saisir le nom du produit"
              />

              <TextField
                control={form.control}
                name="brand"
                label="Marque"
                placeholder="Saisir la marque"
              />

              {env.ENABLE_PRODUCT_WEIGHT && (
                <NumberField
                  control={form.control}
                  name="weight"
                  label="Poids (g)"
                  placeholder="Saisir le poids du produit"
                />
              )}

              <SelectField
                control={form.control}
                name="categoryId"
                label="Catégorie"
                placeholder="Sélectionner la catégorie de produit"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />

              <NumberField
                control={form.control}
                name="retailPrice"
                label="Prix de Vente"
              />

              <ToggleField
                control={form.control}
                name="isActive"
                label="Activer le produit"
              />
            </div>

            <TextAreaField
              control={form.control}
              name="description"
              label="Description (optionnelle)"
              placeholder="Saisir la description du produit"
            />
            {env.ENABLE_PRODUCT_IMAGES && (
              <ProductImagesUploader
                onImageChange={handleImageChange}
                imagePreviews={imageState.previews}
                existingImages={imageState.existing}
                onRemoveExistingImage={handleRemoveExistingImage}
              />
            )}
            <FormActionButtons
              isSubmitting={isLoading}
              onClose={() => navigate("/products")}
              submitLabel="Mettre à jour"
              submittingLabel="Mise à jour..."
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
