'use client'

import axios from "axios";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteUser from "./deleteUser";
import { useAuth } from '@/context/AuthContext';

export default function UpdateUserInfo() {
  const { setAuth } = useAuth();
  const [response, setResponse] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().optional("Name is optional"),
    age: Yup.number().optional("Age is optional"),
    email: Yup.string().email("Invalid email").optional("Email is optional"),
    ciudad: Yup.string().optional("City is optional"),
    intereses: Yup.array().of(Yup.string()).optional("Intereses is optional"),
    ofertas: Yup.boolean(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ submit: "You must be logged in to update your information" });
        return;
      } else {
        const data = {
          ...(values.name && { name: values.name }),
          ...(values.age && { age: values.age }),
          ...(values.email && { email: values.email }),
          ...(values.ciudad && { ciudad: values.ciudad }),
          ...(values.intereses.length > 0 && { intereses: values.intereses }),
          ...(values.ofertas && { ofertas: values.ofertas }),
        };
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const decodeToken = jwtDecode(token);
        const userId = decodeToken._id;
        const response = await axios.put(`http://localhost:3000/api/user/updateUser/${userId}`, data);
        console.log(response);
        if (response.data.error) {
          setErrors({ submit: response.data.error });
        } else {
          setResponse("User updated successfully");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full h-full p-8">
      <h1 className="font-semibold mb-5">Update information from your account</h1>
      <Formik
        initialValues={{ name: "", age: "", email: "", ciudad: "", intereses: [], ofertas: false }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, errors }) => (
          <Form className="mb-5">
            <Field
              className="border border-gray-300 p-2 mb-2 rounded-lg mr-5"
              type="text"
              name="name"
              placeholder="Name"
            />
            <ErrorMessage name="name" component="div" className="text-red-800" />
            <Field
              className="border border-gray-300 p-2 mb-2 rounded-lg mr-5"
              type="number"
              name="age"
              placeholder="Age"
            />
            <ErrorMessage name="age" component="div" className="text-red-800" />
            <Field
              className="border border-gray-300 p-2 mb-2 rounded-lg mr-5"
              type="email"
              name="email"
              placeholder="Email"
            />
            <ErrorMessage name="email" component="div" className="text-red-800" />
            <Field
              className="border border-gray-300 p-2 mb-2 rounded-lg mr-5"
              type="text"
              name="ciudad"
              placeholder="City"
            />
            <ErrorMessage name="ciudad" component="div" className="text-red-800" />
            <Field
              className="border border-gray-300 p-2 mb-2 rounded-lg mr-5"
              type="text"
              name="intereses"
              placeholder="Intereses"
              onChange={(e) => {
                const value = e.target.value;
                if (value.trim() === "") {
                  setFieldValue("intereses", []); // Mantener como array vacío si no hay texto
                } else {
                  const arrayOfInterests = value.split(",").map((item) => item.trim());
                  setFieldValue("intereses", arrayOfInterests);
                }
              }}
            />
            <ErrorMessage name="intereses" component="div" className="text-red-800" />
            <label htmlFor="ofertas" className=" text-gray-400 border border-gray-300 p-2 mb-2 rounded-lg mr-5">
              Recibir ofertas
              <Field
                className="border border-gray-300 p-2 ml-2 mr-2 rounded-lg"
                id="ofertas"
                type="checkbox"
                name="ofertas"
                placeholder="Recibir ofertas"
              />
            </label>
            <button type="submit " disabled={isSubmitting} className="bg-customTeal hover:bg-customTealDark p-2 rounded-md mt-2 font-semibold">
              {isSubmitting ? "Loading..." : "Update"}
            </button>
            {errors.submit && <div>{errors.submit}</div>}
          </Form>
        )}
      </Formik>
      {response && <p className="text-green-500 mb-5">{response}</p>}
      <DeleteUser setAuth={setAuth} />
    </div>
  );
}