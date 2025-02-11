import AddButton from "@/components/common/AddButton";
import CustomDialog from "@/components/common/CustomDialog";
import FormActionButtons from "@/components/common/FormActionButtons";
import TagFiled from "@/components/common/fields/TagFiled";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/product.dto";

import useCreateVariantsForm from "./useCreateVariantsForm";

export default function CreateVariantDialog({ product }: { product: Product }) {
  const { form, isOpen, setIsOpen, isSubmitting, handleClose, onSubmit } =
    useCreateVariantsForm(product);

  return (
    <CustomDialog
      trigger={<AddButton label="Ajouter des variantes" />}
      title="Créer des variantes de produits"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {product.category.categoryAttributes.map((catAttr) => (
            <TagFiled
              key={catAttr.id}
              control={form.control}
              type={catAttr.attribute.type}
              name={`attributeValues.${catAttr.attribute.id}`}
              label={`${catAttr.attribute.name} ${
                catAttr.isPrimary ? "(Principal)" : ""
              }`}
              placeholder="Entrez les valeurs séparées par des virgules"
            />
          ))}
          <FormActionButtons
            onClose={handleClose}
            isSubmitting={isSubmitting}
            submitLabel="Créer les variantes"
            submittingLabel="Créer..."
          />
        </form>
      </Form>
    </CustomDialog>
  );
}
