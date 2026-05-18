'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface ImageEntry {
  id: string;
  url: string;
  file?: File;
  isNew?: boolean;
  isRemoved?: boolean;
}

interface ImageUploaderProps {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const newImages: ImageEntry[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Solo se permiten archivos de imagen');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Las imágenes deben ser menores a 5MB');
          continue;
        }

        // Create preview URL for display
        const previewUrl = URL.createObjectURL(file);

        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: previewUrl,
          file,
          isNew: true,
        });
      }

      // Check max images limit
      const totalAfterAdd = images.length + newImages.length;
      if (totalAfterAdd > maxImages) {
        setError(`Máximo ${maxImages} imágenes permitidas`);
        onChange([...images, ...newImages.slice(0, maxImages - images.length)]);
      } else {
        onChange([...images, ...newImages]);
      }
    } catch (err) {
      setError('Error procesando imagenes');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Check if URL is from S3/CDN (needs unoptimized)
  const isCDNUrl = (url: string) => {
    return url.includes('s3.') || url.includes('cdn.') || url.includes('idrivee2') || url.includes('facebook.com') || url.includes('r2.dev');
  };

  return (
    <div className="space-y-4">
      {/* File upload button */}
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-file-upload"
        />
        <label
          htmlFor="image-file-upload"
          className={`
            px-4 py-3 bg-[#f9c937] text-black font-archivo-black uppercase text-sm 
            border-4 border-black cursor-pointer
            hover:bg-black hover:text-[#f9c937] transition-colors
            ${uploading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {uploading ? 'Procesando...' : '+ Seleccionar Imágenes'}
        </label>
        <span className="font-plus-jakarta text-xs text-black/50">
          {images.length}/{maxImages} imágenes • Máx 5MB cada una
        </span>
      </div>

      {/* Error message */}
      {error && (
        <p className="font-archivo-black text-xs text-red-500 uppercase">
          {error}
        </p>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video bg-black/5 border-4 border-black overflow-hidden group"
            >
              <Image
                src={image.url}
                alt="Episode image"
                fill
                className="object-cover"
                unoptimized={isCDNUrl(image.url)}
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(image.id)}
                className="
                  absolute top-2 right-2 w-8 h-8 bg-red-500 text-white 
                  font-archivo-black text-sm border-2 border-black
                  opacity-0 group-hover:opacity-100 transition-opacity
                  flex items-center justify-center
                "
              >
                ✕
              </button>

              {/* New badge */}
              {image.isNew && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#f9c937] text-black font-archivo-black text-xs uppercase border-2 border-black">
                  Nueva
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}