import { useEffect, useState } from "react";

import { env } from "@/config/environment";
import { Plus, X } from "lucide-react";

interface ProductImagesUploaderProps {
  onImageChange: (files: File[], previews: string[]) => void;
  imagePreviews: string[];
  existingImages?: string[];
  onRemoveExistingImage?: (imageUrl: string) => void;
}

export function ProductImagesUploader({
  onImageChange,
  imagePreviews,
  existingImages = [],
  onRemoveExistingImage,
}: ProductImagesUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      const previews = filesArray.map((file) => URL.createObjectURL(file));

      setFiles(filesArray);
      onImageChange(filesArray, previews);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = files
      .filter((_, i) => i !== index)
      .map((file) => URL.createObjectURL(file));

    setFiles(updatedFiles);
    onImageChange(updatedFiles, updatedPreviews);
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const removeExistingImage = (imageUrl: string) => {
    onRemoveExistingImage?.(imageUrl);
  };

  useEffect(() => {
    // Clean up preview URLs
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div>
      <div className="flex gap-6 mt-6">
        <label className="flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 shrink-0 hover:bg-muted border rounded-md  cursor-pointer transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Plus className="h-6 w-6 text-muted-foreground mb-1" />
          <span className="text-sm text-center text-muted-foreground">
            Ajouter une image
          </span>
        </label>
        {(existingImages.length > 0 || imagePreviews.length > 0) && (
          <div className="flex gap-6 flex-wrap">
            {existingImages.map((imageUrl) => (
              <div key={imageUrl} className="w-fit relative">
                <img
                  src={`${env.BACKEND_URL}/${imageUrl}`}
                  alt="Existing product"
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md border shrink-0"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(imageUrl)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {imagePreviews.map((preview, index) => (
              <div key={preview} className="w-fit relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border shrink-0"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
