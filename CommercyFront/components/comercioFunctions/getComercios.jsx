'use client';

import axios from "axios";
import React, { useState, useEffect } from "react";

export default function GetComercios({ onSelectCommerce }) {
    const [comercios, setComercios] = useState([]);
    const [error, setError] = useState(null);
    const [isMobileView, setIsMobileView] = useState(false);

    const fetchComercios = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("You must be logged in to fetch commerce data.");
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/comercios`); 
            setComercios(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch commerce data. Please try again.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComercios();
        setIsMobileView(window.innerWidth < 1100);

        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1100);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div>
            <h1 className="pl-7 pt-5 pr-5 font-semibold">All Commerces</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="grid grid-cols-2 p-5">
                {comercios.map((comercio) => (
                    <div
                        key={comercio.id}
                        onClick={() => onSelectCommerce(comercio)}
                        className="bg-white m-2 p-2 rounded-lg shadow-md cursor-pointer text-zinc-600"
                    >
                        <h2>{comercio.nombre}</h2>
                        <p>cif: {comercio.cif}</p>
                        <p>city: {comercio.direccion}</p>
                        <div className={`flex ${isMobileView ? "flex-col" : "flex-row"} justify-between`}>
                            <div>
                                <p>email: {comercio.email}</p>
                                <p>phone: {comercio.telefono}</p>
                            </div>
                            <button className="pl-4 pr-4 text-zinc-800 border-2 border-solid border-zinc-800 rounded hover:bg-gray-700 hover:text-white transition">
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
