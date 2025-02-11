import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createProductSchema } from "@/schemas/product.schema";
import { useUpdateProduct } from "@/swr/products/product.swr";
import { CreateProductDTO } from "@/types/product.dto";
import handleError from "@/utils/handleError";
import { showToast } from "@/utils/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ImageState {
  previews: string[];
  files: File[];
  existing: string[];
}

export function useUpdateProductForm(
  id: string,
  onSuccessCallback?: () => void
) {
  const navigate = useNavigate();
  const [imageState, setImageState] = useState<ImageState>({
    previews: [],
    files: [],
    existing: [],
  });

  const {
    data: product,
    update,
    isUpdating,
    isLoading,
    error,
  } = useUpdateProduct(id);

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
      hasVariants: false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        categoryId: product.categoryId,
        weight: Number(product.weight),
        retailPrice: Number(product.retailPrice),
        wholesalePrice: Number(product.wholesalePrice),
      });

      if (product.imageUrls) {
        setImageState((prev) => ({ ...prev, existing: product.imageUrls }));
      }
    }
  }, [product, form]);

  useEffect(() => {
    if (error) {
      navigate("/products");
      showToast("error", "Échec lors du chargement du produit");
    }
  }, [error, navigate]);

  // Clean up image URLs when component unmounts
  useEffect(() => {
    return () => {
      imageState.previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageState.previews]);

  const handleImageChange = (files: File[], previews: string[]) => {
    setImageState((prev) => ({
      ...prev,
      files,
      previews,
    }));
  };

  const handleRemoveExistingImage = (imageToRemove: string) => {
    setImageState((prev) => ({
      ...prev,
      existing: prev.existing.filter((image) => image !== imageToRemove),
    }));
  };

  const onSubmit = async (values: CreateProductDTO) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value.toString());
        }
      });

      imageState.files.forEach((file) => {
        formData.append("images", file);
      });

      imageState.existing.forEach((imageUrl) => {
        formData.append("existingImages", imageUrl);
      });

      const response = await update(formData);
      showToast(response.status, response.message);
      onSuccessCallback?.();
    } catch (error) {
      console.error({ error });

      handleError(error, "Échec de la mise à jour du produit");
    }
  };

  return {
    form,
    imageState,
    isLoading: isUpdating,
    isFetching: isLoading,
    onSubmit,
    handleImageChange,
    handleRemoveExistingImage,
  };
}
