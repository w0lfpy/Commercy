'use client';

import React from "react";
import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {DeleteCommerce} from "@/components";

export default function UpdateCommerce({ commerceData }) {
    const [response, setResponse] = useState(null);

    const validationSchema = Yup.object({
        nombre: Yup.string().optional(),
        cif: Yup.string().optional(),
        direccion: Yup.string().optional(),
        email: Yup.string().email("Invalid email").optional(),
        telefono: Yup.string().optional(),
        id: Yup.string().optional(),
    });

    if (!commerceData) {
        return <h1 className="text-center mt-5">Please select a commerce</h1>;
    }

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrors({ submit: "You must be logged in to update a commerce." });
                return;
            }

            const data = {
                ...(values.nombre && { nombre: values.nombre }),
                ...(values.cif && { cif: values.cif }),
                ...(values.direccion && { direccion: values.direccion }),
                ...(values.email && { email: values.email }),
                ...(values.telefono && { telefono: values.telefono }),
                ...(values.id && { id: values.id }),
            };

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comercios/${commerceData._id}/${commerceData.cif}`, 
                data
            );
            console.log("Commerce updated:", response.data);

            if (response.data.error) {
                setErrors({ submit: response.data.error });
            } else {
                setResponse("Commerce updated successfully");
            }
        } catch (error) {
            console.error("Error updating commerce:", error);

            if (error.response) {
                setErrors({
                    submit: error.response.data.error || "An error occurred on the server.",
                });
            } else if (error.request) {
                setErrors({
                    submit: "Cannot connect to the server. Please try again later.",
                });
            } else {
                setErrors({
                    submit: "An unexpected error occurred. Please try again later.",
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="ml-5 mt-5">
                Update Commerce with CIF: {commerceData.cif}
            </h1>
            <Formik
                initialValues={{
                    nombre: "",
                    cif: "",
                    direccion: "",
                    email: "",
                    telefono: "",
                    id: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="grid grid-cols-2 w-[100%] p-5">
                        <div className="mr-5">
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg mr-5 w-full"
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                            />
                            <ErrorMessage name="nombre" component="div" className="text-red-800" />
                        </div>
                        <div>
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg mr-5 w-full"
                                type="text"
                                name="cif"
                                placeholder="CIF"
                            />
                            <ErrorMessage name="cif" component="div" className="text-red-800" />
                        </div>
                        <div className="mr-5">
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg mr-5 w-full"
                                type="text"
                                name="direccion"
                                placeholder="Direccion"
                            />
                            <ErrorMessage name="direccion" component="div" className="text-red-800" />
                        </div>
                        <div>
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg mr-5 w-full"
                                type="text"
                                name="email"
                                placeholder="Email"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-800" />
                        </div>
                        <div className="mr-5">
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg mr-5 w-full"
                                type="text"
                                name="telefono"
                                placeholder="Telefono"
                            />
                            <ErrorMessage name="telefono" component="div" className="text-red-800" />
                        </div>
                        <div>
                            <Field
                                className="border border-gray-300 p-2 mb-2 rounded-lg mr-5 w-full"
                                type="text"
                                name="id"
                                placeholder="ID"
                            />
                            <ErrorMessage name="id" component="div" className="text-red-800" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-fit p-2 mt-2 rounded-md border border-amber-500 text-amber-500 font-semibold hover:bg-amber-500 hover:text-white"
                        >
                            Update Commerce
                        </button>
                        {errors.submit && (
                            <div className="text-red-800 col-span-2">{errors.submit}</div>
                        )}
                    </Form>
                )}
            </Formik>
            {response && <p className="text-green-500 ml-5 mb-5">{response}</p>}
            <div className="ml-5 mb-5">
                <DeleteCommerce commerceData={commerceData} />
            </div>
        </div>
    );
}
