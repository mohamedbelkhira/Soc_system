import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormActionButtons from "@/components/common/FormActionButtons";
import NumberField from "@/components/common/fields/NumberField";
import SelectField from "@/components/common/fields/SelectField";
import TextAreaField from "@/components/common/fields/TextAreaField";
import TextField from "@/components/common/fields/TextField";
import ToggleField from "@/components/common/fields/ToggleField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { env } from "@/config/environment";
import { useActiveCategories } from "@/swr/products/category.swr";
import handleError from "@/utils/handleError";

import { ProductImagesUploader } from "../shared/ProductImagesUploader";
import useCreateProductForm from "./useCreateProductForm";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const { data: categories, error: categoriesError } = useActiveCategories();
  const { form, onSubmit, isSubmitting, imagePreviews, handleImageChange } =
    useCreateProductForm(() => {
      navigate("/products");
    });

  useEffect(() => {
    if (categoriesError) {
      handleError(categoriesError, "Échec lors du chargement des catégories");
    }
  }, [categoriesError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau produit</CardTitle>
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
                placeholder="Saisir le prix de détail"
              />
              <ToggleField
                control={form.control}
                name="hasVariants"
                label="A des variantes"
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
                imagePreviews={imagePreviews}
              />
            )}
            <FormActionButtons
              onClose={() => navigate("/products")}
              isSubmitting={isSubmitting}
              submitLabel="Créer le Produit"
              submittingLabel="Création..."
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
