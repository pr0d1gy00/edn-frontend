"use client";

import { toast, Toaster as SonnerToaster } from "sonner";

type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export function Toaster({
  position = "bottom-right",
}: {
  position?: ToastPosition;
}) {
  return (
    <SonnerToaster
      position={position}
      theme="dark"
      richColors
toastOptions={{
        style: {
          background: "#000000",
          border: "3px solid #f9c937",
          color: "#ffffff",
          fontFamily: "var(--font-archivo-black), system-ui",
        },
      }}
    />
  );
}

export const toastSuccess = {
  userCreated: () =>
    toast.success("¡Eso menorsita, a tripear! Usuario creado 🔥"),
  userUpdated: () =>
    toast.success("¡Saime actualizado papa! Usuario actualizado ✨"),
  userDeleted: () => toast.success("¡Coño e'tu madreeee! Usuario eliminado 💃"),
};

export const toastError = {
  generic: (message = "Algo salió mal") => toast.error(message),
  create: () => toast.error("Error al crear el usuario"),
  update: () => toast.error("Error al actualizar el usuario"),
  delete: () => toast.error("Error al eliminar el usuario"),
};

export { toast };
