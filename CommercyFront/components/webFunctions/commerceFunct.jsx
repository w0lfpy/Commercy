import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {jwtDecode} from "jwt-decode";
import CreateWeb from "./createWeb";
import UpdateWeb from "./updateWeb";
import UploadImg from "./uploadImg";
import InterestedWeb from "./interestedWeb";

export default function CommerceForm() {
    const [commerceToken, setCommerceToken] = React.useState("");
    const [commerceCif, setCommerceCif] = React.useState("");
    const [commerceAuth, setCommerceAuth] = React.useState(false);

    const dashboardWeb = [
        {
            name: "Create Web",
            component: <CreateWeb />,
        },
        {
            name: "Update Web",
            component: <UpdateWeb />,
        },
        {
            name: "Upload Image",
            component: <UploadImg />,
        },
        {
            name: "Interested Web",
            component: <InterestedWeb />,
        },
    ];

    const [selectedComponent, setSelectedComponent] = useState(dashboardWeb[0].name);

    const handleClick = (componentName) => {
        setSelectedComponent(componentName);
    };
    const validationSchema = Yup.object({
        token: Yup.string().required("Token is required"),
        cif: Yup.string().required("CIF is required"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            if (!values.token || !values.cif) {
                setErrors({ submit: "You must be logged in to access the commerce dashboard" });
                return;
            } else {
                if (!values.token || !values.cif) {
                    setErrors({ submit: "You must provide both token and CIF to access the commerce dashboard" });
                    return;
                }

                // Decodifica el token y verifica el CIF
                let decodedToken;
                try {
                    decodedToken = jwtDecode(values.token);
                } catch (error) {
                    setErrors({ submit: "Invalid token format. Please provide a valid token." });
                    return;
                }

                if (decodedToken.cif?.toLowerCase() !== values.cif.toLowerCase()) {
                    setErrors({ submit: "CIF does not match the token." });
                    return;
                }

                // Si el CIF coincide, autentica al comercio
                setCommerceCif(values.cif);
                setCommerceToken(values.token);
                setCommerceAuth(true);
                localStorage.setItem("commerceToken", values.token);
                localStorage.setItem("commerceCif", values.cif);
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
            <div>
                {commerceAuth ? (
                    <div className="p-5 bg-gray-100 h-screen">
                        <div className="p-5 h-[95vh] w-full bg-white shadow-md rounded-lg">
                            <h1 className="text-center font-semibold text-xl">COMMERCE DASHBOARD</h1>
                            <div className="flex flex-row p-5">
                                <div className="flex flex-col h-fit w-[25%] bg-customTeal p-5 mr-2 rounded-xl shadow-md">
                                    <div className="text-left">
                                        {dashboardWeb.map((item, index) => (
                                            <div key={index} className="mb-3 mt-3 font-semibold">
                                                <button onClick={() => handleClick(item.name)} className={`${selectedComponent === item.name ? "text-zinc-800" : "text-customTealDark"}`}>{item.name}</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-[75%] h-full min-h-[200px] rounded-xl shadow-md bg-gray-100">
                                    {dashboardWeb.find((item) => item.name === selectedComponent)?.component}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Formik
                        initialValues={{ token: "", cif: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors }) => (
                            <Form className="grid grid-cols-2 w-[100%] p-5">
                                <div className="mr-5">
                                    <label htmlFor="token" className="font-semibold">Token</label>
                                    <Field type="text" id="token" name="token" className="w-full p-2 rounded-lg" />
                                    <ErrorMessage name="token" component="div" className="text-red-500" />
                                </div>
                                <div className="ml-5">
                                    <label htmlFor="cif" className="font-semibold">CIF</label>
                                    <Field type="text" id="cif" name="cif" className="w-full p-2 rounded-lg" />
                                    <ErrorMessage name="cif" component="div" className="text-red-500" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="col-span-2 w-full mt-5 p-4 font-semibold rounded-lg bg-customTeal text-zinc-800"
                                >
                                    Submit
                                </button>
                                {errors.submit && <div className="text-red-500">{errors.submit}</div>}
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
}