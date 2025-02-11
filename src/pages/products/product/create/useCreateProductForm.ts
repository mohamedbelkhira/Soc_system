import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createProductSchema } from "@/schemas/product.schema";
import { useCreateProduct } from "@/swr/products/product.swr";
import { CreateProductDTO } from "@/types/product.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function useCreateProductForm(onSuccessCallback?: () => void) {
  const { create, isCreating, error } = useCreateProduct();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      weight: 0,
      retailPrice: 0,
      wholesalePrice: 0,
      categoryId: "",
      hasVariants: true,
      isActive: true,
    },
  });

  // Clean up image URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageChange = (files: File[], previews: string[]) => {
    setImageFiles(files);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews(previews);
  };

  const onSubmit = async (values: CreateProductDTO) => {
    try {
      const formData = new FormData();

      // Append all form values except images
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value.toString());
        }
      });

      // Append image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await create(formData);

      if (error) {
        handleError(error, "Échec de la création du produit");
      } else {
        showToast(response.status, response.message);
        onSuccessCallback?.();
        form.reset();
        setImageFiles([]);
        setImagePreviews([]);
      }
    } catch (error) {
      handleError(error, "Échec de la création du produit");
    }
  };

  useEffect(() => {
    if (error) handleError(error, "Échec de la création du produit");
  }, [error]);

  return {
    form,
    isSubmitting: isCreating,
    onSubmit,
    imagePreviews,
    imageFiles,
    handleImageChange,
  };
}
