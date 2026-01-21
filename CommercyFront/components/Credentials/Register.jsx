'use client';

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState("");

    const validationSchema = Yup.object({
        name: Yup.string().required("Nombre requerido"),
        age: Yup.number()
            .required("Edad requerida")
            .positive("Debe ser un número positivo")
            .integer("Debe ser un número entero")
            .min(18, "Debes ser mayor de edad"),
        email: Yup.string().email("Correo inválido").required("Correo requerido"),
        password: Yup.string()
            .required("Contraseña requerida")
            .min(6, "La contraseña debe tener al menos 6 caracteres"),
        ciudad: Yup.string().required("Ciudad requerida"),
        intereses: Yup.string(),
    });

    const handleRegister = async (values) => {
        setError("");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    intereses: values.intereses.split(",").map((str) => str.trim()),
                }),
            });

            if (!res.ok) {
                throw new Error("Email ya registrado");
            }
            router.push("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-zinc-800">
            <div className="w-full max-w-md">
                <div className="mb-4">
                    <Link href="/" className="text-green-500 hover:underline flex items-center">
                        ← Go Back
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Crear cuenta
                    </h1>
                    <Formik
                        initialValues={{
                            name: "",
                            age: "",
                            email: "",
                            password: "",
                            ciudad: "",
                            intereses: "",
                            ofertas: false,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            handleRegister(values);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Nombre completo"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <Field
                                        type="number"
                                        name="age"
                                        placeholder="Edad"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Correo electrónico"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <Field
                                        type="text"
                                        name="ciudad"
                                        placeholder="Ciudad"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="ciudad" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <Field
                                        type="text"
                                        name="intereses"
                                        placeholder="Intereses (separados por coma)"
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <ErrorMessage name="intereses" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="flex items-center">
                                    <Field type="checkbox" name="ofertas" className="mr-2" />
                                    <label>Quiero recibir ofertas</label>
                                </div>
                                {error && <div className="text-red-500 text-sm">{error}</div>}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    {isSubmitting ? "Cargando..." : "Crear cuenta"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <p className="mt-4 text-center text-sm">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="text-green-500 hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
