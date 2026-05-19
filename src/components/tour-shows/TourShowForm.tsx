"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { TourShow } from "@/types/tourShow";
import { useCreateTourShow } from "@/hooks/useCreateTourShow";
import { useUpdateTourShow } from "@/hooks/useUpdateTourShow";
import { toast } from "@/components/ui/Toast";
import ImageUpload from "./ImageUpload";

interface ValidationErrors {
  city?: string;
  country?: string;
  venueName?: string;
  showDate?: string;
  ticketStatus?: string;
  latitude?: string;
  longitude?: string;
}

function validate(fields: {
  city: string;
  country: string;
  venueName: string;
  showDate: string;
  ticketStatus: string;
  latitude: string;
  longitude: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!fields.city.trim()) {
    errors.city = "La ciudad es requerida";
  }

  if (!fields.country.trim()) {
    errors.country = "El país es requerido";
  }

  if (!fields.venueName.trim()) {
    errors.venueName = "El lugar es requerido";
  }

  if (!fields.showDate.trim()) {
    errors.showDate = "La fecha del show es requerida";
  }

  if (!fields.ticketStatus.trim()) {
    errors.ticketStatus = "El estado es requerido";
  }

  if (fields.latitude.trim()) {
    const lat = Number(fields.latitude);
    if (isNaN(lat)) {
      errors.latitude = "La latitud debe ser un número válido";
    }
  }

  if (fields.longitude.trim()) {
    const lng = Number(fields.longitude);
    if (isNaN(lng)) {
      errors.longitude = "La longitud debe ser un número válido";
    }
  }

  return errors;
}

interface TourShowFormProps {
  mode: "create" | "edit";
  initialData?: TourShow | null;
}

export default function TourShowForm({ mode, initialData }: TourShowFormProps) {
  const router = useRouter();
  const {
    createTourShow,
    loading: createLoading,
    error: createError,
  } = useCreateTourShow();
  const {
    updateTourShow,
    loading: updateLoading,
    error: updateError,
  } = useUpdateTourShow();

  const [city, setCity] = useState(initialData?.city || "");
  const [country, setCountry] = useState(initialData?.country || "");
  const [venueName, setVenueName] = useState(initialData?.venueName || "");
  const [showDate, setShowDate] = useState(
    initialData?.showDate
      ? initialData.showDate.substring(0, 16)
      : "",
  );
  const [ticketUrl, setTicketUrl] = useState(initialData?.ticketUrl || "");
  const [ticketStatus, setTicketStatus] = useState<
    "AVAILABLE" | "FEW_TICKETS" | "SOLD_OUT" | ""
  >(initialData?.ticketStatus || "");
  const [latitude, setLatitude] = useState(
    initialData?.latitude?.toString() || "",
  );
  const [longitude, setLongitude] = useState(
    initialData?.longitude?.toString() || "",
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const loading = mode === "create" ? createLoading : updateLoading;
  const apiError = mode === "create" ? createError : updateError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate({
      city,
      country,
      venueName,
      showDate,
      ticketStatus,
      latitude,
      longitude,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("city", city.trim());
    formData.append("country", country.trim());
    formData.append("venueName", venueName.trim());
    formData.append("showDate", showDate);
    formData.append("ticketUrl", ticketUrl.trim());
    formData.append("ticketStatus", ticketStatus);

    if (latitude.trim()) {
      formData.append("latitude", latitude.trim());
    }
    if (longitude.trim()) {
      formData.append("longitude", longitude.trim());
    }

    // Append new image files
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    if (mode === "create") {
      const result = await createTourShow(formData);
      if (result) {
        toast.success("¡Fecha de tour creada! 🔥");
        router.push("/dashboard/tour-shows");
      }
    } else if (initialData?.id) {
      const result = await updateTourShow(initialData.id, formData);
      if (result) {
        toast.success("¡Fecha de tour actualizada! ✨");
        router.push("/dashboard/tour-shows");
      }
    }
  };

  const submitLabel =
    mode === "create"
      ? loading
        ? "Creando..."
        : "Crear Fecha"
      : loading
        ? "Guardando..."
        : "Guardar cambios";

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

        {/* City */}
        <div>
          <label
            htmlFor="show-city"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Ciudad *
          </label>
          <input
            id="show-city"
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (errors.city)
                setErrors((prev) => ({ ...prev, city: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.city ? "border-red-500" : "border-black"
            }`}
            placeholder="Ej: Buenos Aires"
          />
          {errors.city && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.city}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="show-country"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            País *
          </label>
          <input
            id="show-country"
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              if (errors.country)
                setErrors((prev) => ({ ...prev, country: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.country ? "border-red-500" : "border-black"
            }`}
            placeholder="Ej: Argentina"
          />
          {errors.country && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.country}
            </p>
          )}
        </div>

        {/* Venue Name */}
        <div>
          <label
            htmlFor="show-venue"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Lugar *
          </label>
          <input
            id="show-venue"
            type="text"
            value={venueName}
            onChange={(e) => {
              setVenueName(e.target.value);
              if (errors.venueName)
                setErrors((prev) => ({ ...prev, venueName: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.venueName ? "border-red-500" : "border-black"
            }`}
            placeholder="Ej: Estadio Monumental"
          />
          {errors.venueName && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.venueName}
            </p>
          )}
        </div>

        {/* Show Date */}
        <div>
          <label
            htmlFor="show-date"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Fecha del show *
          </label>
          <input
            id="show-date"
            type="datetime-local"
            value={showDate}
            onChange={(e) => {
              setShowDate(e.target.value);
              if (errors.showDate)
                setErrors((prev) => ({ ...prev, showDate: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.showDate ? "border-red-500" : "border-black"
            }`}
          />
          {errors.showDate && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.showDate}
            </p>
          )}
        </div>

        {/* Ticket URL */}
        <div>
          <label
            htmlFor="show-ticket-url"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Ticket URL
          </label>
          <input
            id="show-ticket-url"
            type="url"
            value={ticketUrl}
            onChange={(e) => setTicketUrl(e.target.value)}
            className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
            placeholder="https://tickets.example.com"
          />
        </div>

        {/* Ticket Status */}
        <div>
          <label
            htmlFor="show-status"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Estado *
          </label>
          <select
            id="show-status"
            value={ticketStatus}
            onChange={(e) => {
              setTicketStatus(
                e.target.value as "AVAILABLE" | "FEW_TICKETS" | "SOLD_OUT" | "",
              );
              if (errors.ticketStatus)
                setErrors((prev) => ({ ...prev, ticketStatus: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.ticketStatus ? "border-red-500" : "border-black"
            }`}
          >
            <option value="">-- Seleccionar --</option>
            <option value="AVAILABLE">DISPONIBLE</option>
            <option value="FEW_TICKETS">¡ÚLTIMAS!</option>
            <option value="SOLD_OUT">AGOTADO</option>
          </select>
          {errors.ticketStatus && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.ticketStatus}
            </p>
          )}
        </div>

        {/* Coordinates row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Latitude */}
          <div>
            <label
              htmlFor="show-lat"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Latitud
            </label>
            <input
              id="show-lat"
              type="text"
              value={latitude}
              onChange={(e) => {
                setLatitude(e.target.value);
                if (errors.latitude)
                  setErrors((prev) => ({ ...prev, latitude: undefined }));
              }}
              className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
                errors.latitude ? "border-red-500" : "border-black"
              }`}
              placeholder="Ej: -34.545"
            />
            {errors.latitude && (
              <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
                {errors.latitude}
              </p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label
              htmlFor="show-lng"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Longitud
            </label>
            <input
              id="show-lng"
              type="text"
              value={longitude}
              onChange={(e) => {
                setLongitude(e.target.value);
                if (errors.longitude)
                  setErrors((prev) => ({ ...prev, longitude: undefined }));
              }}
              className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
                errors.longitude ? "border-red-500" : "border-black"
              }`}
              placeholder="Ej: -58.449"
            />
            {errors.longitude && (
              <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
                {errors.longitude}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
            Imágenes
          </label>
          <ImageUpload
            files={imageFiles}
            onChange={setImageFiles}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="p-6 bg-black/[0.03] border-t-4 border-black">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/tour-shows")}
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
