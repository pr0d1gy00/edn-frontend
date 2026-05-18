'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Guest } from '@/types/guest';
import { useCreateGuest } from '@/hooks/useCreateGuest';
import { useUpdateGuest } from '@/hooks/useUpdateGuest';

interface ValidationErrors {
  name?: string;
  bio?: string;
  twitterHandle?: string;
  instagramHandle?: string;
}

function validate(fields: {
  name: string;
  bio: string;
  twitterHandle: string;
  instagramHandle: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!fields.name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (fields.name.trim().length < 2 || fields.name.trim().length > 50) {
    errors.name = 'El nombre debe tener entre 2 y 50 caracteres';
  }

  if (fields.bio.length > 500) {
    errors.bio = 'La bio no puede exceder 500 caracteres';
  }

  const handleRegex = /^[a-zA-Z0-9_]*$/;
  if (fields.twitterHandle && !handleRegex.test(fields.twitterHandle)) {
    errors.twitterHandle = 'Solo letras, números y guiones bajos';
  }
  if (fields.instagramHandle && !handleRegex.test(fields.instagramHandle)) {
    errors.instagramHandle = 'Solo letras, números y guiones bajos';
  }

  return errors;
}

interface GuestFormProps {
  mode: 'create' | 'edit';
  initialData?: Guest | null;
}

export default function GuestForm({ mode, initialData }: GuestFormProps) {
  const router = useRouter();
  const { createGuest, loading: createLoading, error: createError } = useCreateGuest();
  const { updateGuest, loading: updateLoading, error: updateError } = useUpdateGuest();

  const [name, setName] = useState(initialData?.name || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [twitterHandle, setTwitterHandle] = useState(initialData?.twitterHandle || '');
  const [instagramHandle, setInstagramHandle] = useState(initialData?.instagramHandle || '');

  const [errors, setErrors] = useState<ValidationErrors>({});

  const loading = mode === 'create' ? createLoading : updateLoading;
  const apiError = mode === 'create' ? createError : updateError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate({ name, bio, twitterHandle, instagramHandle });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const input = {
      name: name.trim(),
      bio: bio || undefined,
      twitterHandle: twitterHandle || undefined,
      instagramHandle: instagramHandle || undefined,
    };

    if (mode === 'create') {
      const result = await createGuest(input);
      if (result) {
        router.push('/dashboard/guests');
      }
    } else if (initialData?.id) {
      const result = await updateGuest(initialData.id, input);
      if (result) {
        router.push('/dashboard/guests');
      }
    }
  };

  const submitLabel =
    mode === 'create'
      ? loading
        ? 'Creando...'
        : 'Crear invitado'
      : loading
        ? 'Guardando...'
        : 'Guardar cambios';

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="p-6 space-y-6">
        {/* Form-level API error */}
        {apiError && (
          <div className="p-4 bg-red-500 text-white font-archivo-black uppercase border-4 border-black">
            {apiError}
          </div>
        )}

        {/* Name field */}
        <div>
          <label
            htmlFor="guest-name"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Nombre *
          </label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.name ? 'border-red-500' : 'border-black'
            }`}
            placeholder="Ej: Pablo Molinari"
          />
          {errors.name && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">{errors.name}</p>
          )}
        </div>

        {/* Bio field */}
        <div>
          <label
            htmlFor="guest-bio"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Bio
          </label>
          <textarea
            id="guest-bio"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              if (errors.bio) setErrors((prev) => ({ ...prev, bio: undefined }));
            }}
            rows={4}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 resize-none ${
              errors.bio ? 'border-red-500' : 'border-black'
            }`}
            placeholder="Breve descripción del invitado..."
          />
          <div className="flex justify-between mt-1">
            {errors.bio ? (
              <p className="font-archivo-black text-xs text-red-500 uppercase">{errors.bio}</p>
            ) : (
              <span />
            )}
            <span
              className={`font-archivo-black text-xs ${
                bio.length > 500 ? 'text-red-500' : 'text-black/40'
              }`}
            >
              {bio.length}/500
            </span>
          </div>
        </div>

        {/* Twitter handle field */}
        <div>
          <label
            htmlFor="guest-twitter"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Twitter
          </label>
          <input
            id="guest-twitter"
            type="text"
            value={twitterHandle}
            onChange={(e) => {
              setTwitterHandle(e.target.value);
              if (errors.twitterHandle)
                setErrors((prev) => ({ ...prev, twitterHandle: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.twitterHandle ? 'border-red-500' : 'border-black'
            }`}
            placeholder="pablomolinari (sin @)"
          />
          {errors.twitterHandle && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.twitterHandle}
            </p>
          )}
        </div>

        {/* Instagram handle field */}
        <div>
          <label
            htmlFor="guest-instagram"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Instagram
          </label>
          <input
            id="guest-instagram"
            type="text"
            value={instagramHandle}
            onChange={(e) => {
              setInstagramHandle(e.target.value);
              if (errors.instagramHandle)
                setErrors((prev) => ({ ...prev, instagramHandle: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.instagramHandle ? 'border-red-500' : 'border-black'
            }`}
            placeholder="pablomolinariok (sin @)"
          />
          {errors.instagramHandle && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.instagramHandle}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="p-6 bg-black/[0.03] border-t-4 border-black">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/guests')}
            className="flex-1 py-4 bg-white text-black font-archivo-black uppercase text-sm border-4 border-black hover:bg-black/[0.05] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-black text-[#f9c937] font-archivo-black uppercase text-sm border-4 border-black hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#f9c937] border-t-transparent rounded-full animate-spin" />
                {submitLabel}
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
