'use client';

import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CreateWeb() {
    const [webToken, setWebToken] = useState("");

    const validationSchema = Yup.object({
        ciudad: Yup.string().required("City is required"),
        actividad: Yup.string().required("Activity is required"),
        titulo: Yup.string().required("Title is required"),
        resumen: Yup.string().required("Summary is required"),
        textos: Yup.array().required("Texts are required"),
        imagenes: Yup.array().required("Images are required"),
        cifComercio: Yup.string().required("Commerce CIF is required"),
        reseñas: Yup.array().required("Reviews are required"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const token = localStorage.getItem("commerceToken");
            if (!token) {
                setErrors({ submit: "You must be logged in to create a web" });
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/web`, values); 
            setWebToken(response.data.token);
            console.log("Web created successfully:", response.data.web);
            localStorage.setItem("web", JSON.stringify(values));

            if (response.data.error) {
                setErrors({ submit: response.data.error });
            }
        } catch (error) {
            console.error("Error details:", error);

            if (error.response) {
                setErrors({
                    submit: error.response.data.error || "An error occurred on the server.",
                });
            } else if (error.request) {
                setErrors({ submit: "Cannot connect to the server. Please try again later." });
            } else {
                setErrors({ submit: "An unexpected error occurred. Please try again later." });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <h1 className="ml-5 mt-5 font-semibold">Create Web</h1>
            <Formik
                initialValues={{
                    ciudad: "",
                    actividad: "",
                    titulo: "",
                    resumen: "",
                    textos: [],
                    imagenes: [],
                    cifComercio: "",
                    reseñas: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="w-[100%] p-5">
                        <div className="mr-5 gap-5 grid grid-cols-2">
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                                type="text"
                                name="ciudad"
                                placeholder="City"
                            />
                            <ErrorMessage name="ciudad" component="div" className="text-red-500" />
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                                type="text"
                                name="actividad"
                                placeholder="Activity"
                            />
                            <ErrorMessage name="actividad" component="div" className="text-red-500" />
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                                type="text"
                                name="titulo"
                                placeholder="Title"
                            />
                            <ErrorMessage name="titulo" component="div" className="text-red-500" />
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                                type="text"
                                name="resumen"
                                placeholder="Summary"
                            />
                            <ErrorMessage name="resumen" component="div" className="text-red-500" />
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                                type="text"
                                name="cifComercio"
                                placeholder="Commerce CIF"
                            />
                            <ErrorMessage
                                name="cifComercio"
                                component="div"
                                className="text-red-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="col-span-2 w-full mt-5 p-4 font-semibold rounded-lg bg-customTeal text-zinc-800"
                        >
                            Submit
                        </button>
                        {errors.submit && <div className="text-red-500 mt-2">{errors.submit}</div>}
                    </Form>
                )}
            </Formik>
            {webToken && <p className="ml-5 mt-5">Web Token: {webToken}</p>}
        </div>
    );
}