import React, { useRef, useState } from 'react';
import { UploadImageButton } from './upload-image-button';
import { XIcon } from 'lucide-react';

/**
 * ImageUploadPreview handles image file selection, preview, and removal.
 * It renders a hidden file input, an upload button, and a preview with a remove option.
 *
 * @param onImageChange Callback invoked with the selected File or null when removed.
 */
export function ImageUploadPreview({
  onImageChange,
}: {
  onImageChange?: (file: File | null) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Converts a File object to a Data URL for preview.
   * @param file The image file to convert.
   * @returns Promise that resolves to a Data URL string.
   */
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = await fileToDataUrl(file);
      setImageUrl(url);
      onImageChange?.(file);
    }
  }

  function handleUploadButtonClick() {
    fileInputRef.current?.click();
  }

  function removeImage() {
    setImage(null);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageChange?.(null);
  }

  return (
    <div className="flex flex-col items-start w-full">
      {imageUrl && (
        <div className="flex flex-col items-start mb-2">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <img
              src={imageUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-xs hover:bg-black/80 transition"
              aria-label="Remove image"
            >
              <XIcon className="size-3" />
            </button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
      <UploadImageButton onClick={handleUploadButtonClick} />
    </div>
  );
}
