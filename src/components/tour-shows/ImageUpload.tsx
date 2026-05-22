'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingImages?: {url:string, id:string}[]; // URLs from backend
  onRemoveExisting?: (index: number) => void; // called when user removes an existing image
  error?: string;
  maxFiles?: number;
}

export default function ImageUpload({
  files,
  onChange,
  existingImages = [],
  onRemoveExisting,
  error,
  maxFiles = 5,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const newFiles = Array.from(selectedFiles).filter((f) =>
        f.type.startsWith('image/'),
      );

      const totalAfterAdd = files.length + existingImages.length + newFiles.length;
      if (totalAfterAdd > maxFiles) {
        return;
      }

      onChange([...files, ...newFiles]);
    },
    [files, existingImages, maxFiles, onChange],
  );

  const handleRemoveNew = useCallback(
    (index: number) => {
      const updated = files.filter((_, i) => i !== index);
      onChange(updated);
    },
    [files, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const isExceeded = error && error.includes('Máximo');
  const totalCount = files.length + existingImages.length;

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          cursor-pointer p-8 text-center transition-colors border-4
          ${isDragOver
            ? 'border-black bg-[#f9c937]/20 border-solid'
            : isExceeded
              ? 'border-red-500 border-dashed'
              : 'border-black/30 border-dashed hover:border-black/60'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <p className="font-archivo-black text-sm text-black/50 uppercase">
          Arrastrá tus imágenes o hacé click para seleccionar
        </p>
        <p className="font-plus-jakarta text-xs text-black/40 mt-1">
          {totalCount}/{maxFiles} imágenes
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 font-archivo-black text-xs text-red-500 uppercase">
          {error}
        </p>
      )}

      {/* Existing images from backend */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {existingImages.map((img, index) => (
            <div
              key={`existing-${index}`}
              className="relative w-20 h-20 border-4 border-black rounded-sm overflow-hidden"
            >
              <Image
                src={img.url}
                alt={`Imagen existente ${index + 1}`}
                fill
                className="object-cover"
              />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveExisting(index);
                  }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white font-archivo-black text-xs border-2 border-black rounded-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New file previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {files.map((file, index) => (
            <div
              key={`new-${file.name}-${index}`}
              className="relative w-20 h-20 border-4 border-black rounded-sm overflow-hidden"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`Imagen nueva ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveNew(index);
                }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-black text-[#f9c937] font-archivo-black text-xs border-2 border-black rounded-sm hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
