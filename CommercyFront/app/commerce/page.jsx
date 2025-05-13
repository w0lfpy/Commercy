'use client';

import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import {jwtDecode} from "jwt-decode"; 
import { Router } from "next/router";

export default function CommerceLog() {
    const router = useRouter();
    const validationSchema = Yup.object({
        token: Yup.string().required("Required"),
        cif: Yup.string().required("Required"),
    });

    const handleSubmit = async (values, { setErrors }) => {
        try {
            if (!values.token || !values.cif) {
                setErrors({ submit: "Please fill out all fields" });
                return;
            }

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

            localStorage.setItem("commerceToken", values.token);
            localStorage.setItem("commerceCif", values.cif);
            router.push(`/commerce/${values.cif.toLowerCase()}`);
        } catch (error) {
            console.error("An unexpected error happened:", error);
            setErrors({ submit: "An unexpected error occurred. Please try again." });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-zinc-800">
            <Formik
                initialValues={{ token: "", cif: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                        <input
                            className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                            type="text"
                            name="token"
                            placeholder="Token"
                            value={values.token}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.token && errors.token && (
                            <div className="text-red-500">{errors.token}</div>
                        )}
                        <input
                            className="border border-gray-300 p-2 mb-2 rounded-lg w-full"
                            type="text"
                            name="cif"
                            placeholder="CIF"
                            value={values.cif}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {touched.cif && errors.cif && (
                            <div className="text-red-500">{errors.cif}</div>
                        )}
                        <button
                            type="submit"
                            className="bg-customTeal text-white px-4 py-2 rounded-lg mt-4"
                        >
                            Submit
                        </button>
                        {errors.submit && (
                            <div className="text-red-500 mt-2">{errors.submit}</div>
                        )}
                    </form>
                )}
            </Formik>
        </div>
    );
}
