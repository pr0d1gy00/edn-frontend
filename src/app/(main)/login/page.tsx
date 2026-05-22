"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
// Validation schemas
const registerSchema = z
  .object({
    username: z
      .string()
      .min(
        3,
        "Mira vale! Inventate algo mas largo vale... Mínimo 3 caracteres para el apodo",
      ),
    email: z
      .string()
      .email(
        "Este si es gafo!! Vas a entrar sin correo pues. Email válido requerido",
      ),
    password: z
      .string()
      .min(6, "No te metas en tanta vaina!! Mínimo 6 caracteres")
      .max(20, "Mira vale! No te metas en tanta vaina, maximo 20 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Ahora se te olvida las vainas pues! Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Chamo, mete los datos pues!! El apodo es requerido"),
  password: z
    .string()
    .min(1, "Dale pues, mete la contraseña o te quedas fuera!!"),
});

type RegisterForm = z.infer<typeof registerSchema>;
type LoginForm = z.infer<typeof loginSchema>;

// EDN-themed error messages
const EDN_ERRORS: Record<string, string> = {
  "User already exists": "Ese apodo ya lo tiene otro esdenauta, busca otro",
  "Invalid credentials": "Revisá los datos vale, que no cuadran",
  "User not found": "Aquí no encontramos a nadie con ese apodo chamo/a",
  "Wrong password": "La contraseña está mala, fijate de nuevo",
  "Email already in use": "Ya otro vale se registró con ese correo",
  "Username taken": "Ese apodo ya lo tiene otro esdenauta",
};

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,

          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message =
          EDN_ERRORS[result.message] ||
          result.message ||
          "Error en el registro";
        throw new Error(message);
      }

      setSuccess("¡Bienvenido a la escuela! Ya podés entrar.");
      setTimeout(() => {
        setIsRegister(false);
        loginForm.reset();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message =
          EDN_ERRORS[result.message] || result.message || "Error en el login";
        throw new Error(message);
      }

      // Use auth store with cookies instead of localStorage
      console.log(result);
      if (result.accessToken) {
        const decodedData: {
          sub: string;
          username: string;
          email: string;
          role: string;
        } = jwtDecode(result.accessToken);
        useAuthStore.getState().login(
          {
            id: decodedData.sub,
            username: decodedData.username,
            email: decodedData.email,
            role: decodedData.role,
          },
          result.accessToken,
          result.refreshToken,
        );
      }

      setSuccess("¡Bienvenido de vuelta, esdenauta!");
      setTimeout(() => {
        loginForm.reset();
        router.push("/");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/imagen-login-jpg.jpg"
          alt="Login EDN"
          fill
          className="object-cover"
        />
        {/* Yellow overlay */}
        <div className="absolute inset-0 bg-[#f9c937]/30 mix-blend-overlay" />

        {/* Branding text on image */}
        <div className="absolute bottom-12 left-12 right-12">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.9)]">
              ESCUELA DE NADA
            </h2>
            <p className="font-plus-jakarta text-lg text-white/90 mt-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
              El podcast donde aprendemos a no aprender nada útil
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form (YELLOW BACKGROUND) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f9c937] p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="font-syne text-5xl md:text-6xl font-extrabold text-black uppercase tracking-tighter leading-none">
              {isRegister ? "INSCRIBITE" : "ENTRAR"}
            </h1>
            <div className="mt-2 mx-auto w-24 h-2 bg-black" />
            <p className="font-plus-jakarta text-black/70 mt-4 font-medium">
              {isRegister
                ? "Sumate a la lista de los que no saben nada"
                : "Bienvenido de vuelta al desconocimiento"}
            </p>
          </div>

          {/* Tab switcher - NEO BRUTALIST */}
          <div className="flex mb-8 border-4 border-black">
            <button
              onClick={() => {
                setIsRegister(false);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-4 font-archivo-black uppercase tracking-wider text-lg transition-all ${
                !isRegister
                  ? "bg-black text-[#f9c937]"
                  : "bg-white text-black hover:bg-black/20"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-4 font-archivo-black uppercase tracking-wider text-lg transition-all ${
                isRegister
                  ? "bg-black text-[#f9c937]"
                  : "bg-white text-black hover:bg-black/20"
              }`}
            >
              Registro
            </button>
          </div>

          {/* Error/Success messages - NEO BRUTALIST */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-white border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="font-archivo-black text-red-600 text-center uppercase tracking-wide">
                  {error}
                </p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-white border-4 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <p className="font-archivo-black text-green-600 text-center uppercase tracking-wide">
                  {success}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms - NEO BRUTALIST inputs */}
          <AnimatePresence mode="wait">
            {!isRegister ? (
              // LOGIN FORM
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-5"
              >
                <div>
                  <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                    Apodo
                  </label>
                  <input
                    type="text"
                    {...loginForm.register("username")}
                    className="w-full px-4 py-4 bg-white border-4 border-black rounded-md font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Tu apodo de esdenauta"
                  />
                  {loginForm.formState.errors.username && (
                    <p className="mt-1 font-archivo-black text-red-600 text-xs uppercase">
                      {loginForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    {...loginForm.register("password")}
                    className="w-full px-4 py-4 bg-white border-4 border-black rounded-md font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Tu contraseña secreta"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 font-archivo-black text-red-600 text-xs uppercase">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{
                    translateX: -4,
                    translateY: -4,
                    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
                  }}
                  whileTap={{
                    translateX: 0,
                    translateY: 0,
                    boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
                  }}
                  className="w-full py-5 bg-black text-[#f9c937] font-archivo-black uppercase tracking-wider text-xl rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Entrando..." : "ENTRAR A LA ESCUELA"}
                </motion.button>

                <p className="text-center font-plus-jakarta text-black/60 text-sm mt-4">
                  ¿No tenés cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="font-archivo-black text-black underline uppercase tracking-wide hover:text-black/70"
                  >
                    Inscribite ahora
                  </button>
                </p>
              </motion.form>
            ) : (
              // REGISTER FORM
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-5"
              >
                <div>
                  <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                    Apodo
                  </label>
                  <input
                    type="text"
                    {...registerForm.register("username")}
                    className="w-full px-4 py-4 bg-white border-4 border-black rounded-md font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Ej: ElQueNoSabeNada"
                  />
                  {registerForm.formState.errors.username && (
                    <p className="mt-2 font-black text-black text-xs uppercase ">
                      <span className="text-red-600">Alerta! </span>
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    {...registerForm.register("email")}
                    className="w-full px-4 py-4 bg-white border-4 border-black rounded-md font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="tu@email.com"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="mt-2 font-black text-black text-xs uppercase ">
                      <span className="text-red-600">Alerta! </span>
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    {...registerForm.register("password")}
                    className="w-full px-4 py-4 bg-white border-4 border-black rounded-md font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Mínimo 6 caracteres"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="mt-2 font-black text-black text-xs uppercase ">
                      <span className="text-red-600">Alerta! </span>
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-archivo-black uppercase text-sm text-black mb-2 tracking-wide">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    {...registerForm.register("confirmPassword")}
                    className="w-full px-4 py-4 bg-white border-4 border-black rounded-md font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Repetí la contraseña"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="mt-2 font-black text-black text-xs uppercase ">
                      <span className="text-red-600">Alerta! </span>
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{
                    translateX: -4,
                    translateY: -4,
                    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
                  }}
                  whileTap={{
                    translateX: 0,
                    translateY: 0,
                    boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)",
                  }}
                  className="w-full py-5 bg-black text-[#f9c937] font-archivo-black uppercase tracking-wider text-xl rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Inscribiendo..." : "INSCRIBIRME EN LA ESCUELA"}
                </motion.button>

                <p className="text-center font-plus-jakarta text-black/60 text-sm mt-4">
                  ¿Ya tenés cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="font-archivo-black text-black underline uppercase tracking-wide hover:text-black/70"
                  >
                    Entrá acá
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="font-archivo-black text-black/60 hover:text-black uppercase tracking-wide text-sm transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
