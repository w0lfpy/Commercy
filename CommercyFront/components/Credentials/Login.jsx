'use client';

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Correo requerido"),
    password: Yup.string()
      .required("Contraseña requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  const handleLogin = async (values) => {
    try {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Email o contraseña incorrectos");
      }

      const { token, user } = await res.json();
      setAuth(token, user.role);
      router.push("/");
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-zinc-800">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link href="/" className="text-blue-500 hover:underline">← Go Back</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Iniciar sesión</h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Cargando..." : "Entrar"}
                </button>
              </Form>
            )}
          </Formik>
          <p className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">Regístrate aquí</Link>
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
