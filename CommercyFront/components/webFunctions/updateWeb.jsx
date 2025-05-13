'use client';

import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteWeb from "./deleteWeb";

export default function UpdateWeb() {
    const validationSchema = Yup.object({
        ciudad: Yup.string(),
        actividad: Yup.string(),
        titulo: Yup.string(),
        resumen: Yup.string(),
        textos: Yup.array(),
        imagenes: Yup.array(),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const commerceToken = localStorage.getItem("commerceToken");
            const commerceCif = localStorage.getItem("commerceCif")?.toLowerCase();
            const data = {
                ...(values.ciudad && { ciudad: values.ciudad }),
                ...(values.actividad && { actividad: values.actividad }),
                ...(values.titulo && { titulo: values.titulo }),
                ...(values.resumen && { resumen: values.resumen }),
                ...(values.textos && { textos: values.textos }),
                ...(values.imagenes && { imagenes: values.imagenes }),
            };

            if (!commerceToken) {
                setErrors({ submit: "You must be logged in to update a web" });
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${commerceToken}`;
            const response = await axios.put(`http://localhost:3000/api/web/${commerceCif}`, data); 

            if (response.data.error) {
                setErrors({ submit: response.data.error });
            } else {
                console.log("Web updated successfully:", response.data);
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
        <div>
            <h1 className="ml-5 mt-5 font-semibold">Update Web</h1>
            <Formik
                initialValues={{
                    ciudad: "",
                    actividad: "",
                    titulo: "",
                    resumen: "",
                    textos: [],
                    imagenes: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="grid grid-cols-2 gap-5 w-full p-5">
                        <div>
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
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-fit p-2 mt-2 rounded-md border border-amber-500 text-amber-500 font-semibold hover:bg-amber-500 hover:text-white"
                            >
                                Update Web
                            </button>
                        </div>
                        {errors.submit && (
                            <div className="text-red-500 col-span-2">{errors.submit}</div>
                        )}
                    </Form>
                )}
            </Formik>
            <DeleteWeb />
        </div>
    );
}