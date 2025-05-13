'use client';

import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CreateCommerce() {
    const [commerceToken, setCommerceToken] = useState("");

    const validationSchema = Yup.object({
        nombre: Yup.string().required("Name is required"),
        cif: Yup.string().required("CIF is required"),
        direccion: Yup.string().required("Address is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        telefono: Yup.string().required("Phone is required"),
        id: Yup.string().required("ID is required"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrors({ submit: "You must be logged in to create a commerce" });
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.post("http://localhost:3000/api/comercios", values); 
            setCommerceToken(response.data.token);
            console.log(response.data.comercio);

            if (response.data.error) {
                setErrors({ submit: response.data.error });
            } else {
                console.log("Commerce created successfully:", response.data);
            }
        } catch (error) {
            console.error("Error details:", error);

            if (error.response) {
                setErrors({ submit: error.response.data.error || "An error occurred on the server." });
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
            <h1 className="ml-5 mt-5 font-semibold">Commerce Form</h1>
            <Formik
                initialValues={{ nombre: "", cif: "", direccion: "", email: "", telefono: "", id: "" }}
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
                                type="email"
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
                            className="bg-customTeal text-zinc-800 hover:bg-customTealDark p-2 mt-5 mr-5 rounded-lg font-medium"
                        >
                            Create new commerce
                        </button>
                        {errors.submit && <div className="text-red-800">{errors.submit}</div>}
                        {commerceToken && <div className="text-green-800 w-fit">Commerce created successfully. Token: {commerceToken}</div>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
