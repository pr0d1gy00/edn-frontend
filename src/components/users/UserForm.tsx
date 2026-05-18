"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { User } from "@/types/user";
import { useCreateUser } from "@/hooks/useCreateUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { toastSuccess } from "@/components/ui/Toast";

interface ValidationErrors {
  email?: string;
  username?: string;
  password?: string;
}

function validate(fields: {
  email: string;
  username: string;
  password: string;
  mode: "create" | "edit";
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fields.email.trim()) {
    errors.email = "El email es requerido";
  } else if (!emailRegex.test(fields.email.trim())) {
    errors.email = "Email inválido";
  }

  if (!fields.username.trim()) {
    errors.username = "El usuario es requerido";
  } else if (
    fields.username.trim().length < 2 ||
    fields.username.trim().length > 50
  ) {
    errors.username = "El usuario debe tener entre 2 y 50 caracteres";
  }

  if (fields.mode === "create") {
    if (!fields.password) {
      errors.password = "La contraseña es requerida";
    } else if (fields.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
  }

  return errors;
}

interface UserFormProps {
  mode: "create" | "edit";
  initialData?: User | null;
}

export default function UserForm({ mode, initialData }: UserFormProps) {
  const router = useRouter();
  const {
    createUser,
    loading: createLoading,
    error: createError,
  } = useCreateUser();
  const {
    updateUser,
    loading: updateLoading,
    error: updateError,
  } = useUpdateUser();

  const [email, setEmail] = useState(initialData?.email || "");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">(
    initialData?.role || "USER",
  );
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const loading = mode === "create" ? createLoading : updateLoading;
  const apiError = mode === "create" ? createError : updateError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate({ email, username, password, mode });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    if (mode === "create") {
      const result = await createUser({
        email: email.trim(),
        username: username.trim(),
        password,
        role: role || undefined,
      });
      if (result) {
        toastSuccess.userCreated();
        router.push("/dashboard/users");
      }
    } else if (initialData?.id) {
      const result = await updateUser(initialData.id, {
        email: email.trim() || undefined,
        username: username.trim() || undefined,
        role: role || undefined,
      });
      console.log(result);

      if (result) {
        toastSuccess.userUpdated();
        setMessage("Usuario actualizado exitosamente. Brujita!");
        setTimeout(() => router.push("/dashboard/users"), 1500);
      }
    }
  };

  const submitLabel =
    mode === "create"
      ? loading
        ? "Creando..."
        : "Crear usuario"
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

        {message && (
          <div className="p-4 bg-green-500 text-white font-archivo-black uppercase border-4 border-black">
            {message}
          </div>
        )}

        {/* Email field */}
        <div>
          <label
            htmlFor="user-email"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Email *
          </label>
          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.email ? "border-red-500" : "border-black"
            }`}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.email}
            </p>
          )}
        </div>

        {/* Username field */}
        <div>
          <label
            htmlFor="user-username"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Usuario *
          </label>
          <input
            id="user-username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username)
                setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
              errors.username ? "border-red-500" : "border-black"
            }`}
            placeholder="Nombre de usuario"
          />
          {errors.username && (
            <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
              {errors.username}
            </p>
          )}
        </div>

        {/* Password field (create only) */}
        {mode === "create" && (
          <div>
            <label
              htmlFor="user-password"
              className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
            >
              Contraseña *
            </label>
            <input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`w-full px-4 py-3 bg-white border-4 font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20 ${
                errors.password ? "border-red-500" : "border-black"
              }`}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && (
              <p className="mt-1 font-archivo-black text-xs text-red-500 uppercase">
                {errors.password}
              </p>
            )}
          </div>
        )}

        {/* Role select */}
        <div>
          <label
            htmlFor="user-role"
            className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide"
          >
            Rol
          </label>
          <select
            id="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
            className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black focus:outline-none focus:bg-[#f9c937]/20"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="p-6 bg-black/[0.03] border-t-4 border-black">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
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
