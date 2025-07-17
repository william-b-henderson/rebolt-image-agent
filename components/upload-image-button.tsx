import { UploadIcon } from 'lucide-react';
import { Button } from './ui/button';
import React from 'react';

/**
 * UploadImageButton renders an icon button for image upload.
 * @param onClick Callback to trigger file input dialog.
 */
export function UploadImageButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      type="button"
      size="icon"
      className="size-8 absolute left-2 bottom-2"
      variant="outline"
      onClick={onClick}
      aria-label="Upload image"
    >
      <UploadIcon className="size-4" />
    </Button>
  );
}
