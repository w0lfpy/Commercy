'use client';

import React, { useState } from "react";
import axios from "axios";

export default function InterestedWeb() {
    const [interested, setInterested] = useState([]);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError(""); 
        try {
            const commerceToken = localStorage.getItem("commerceToken");
            const commerceCif = localStorage.getItem("commerceCif")?.toLowerCase();

            if (!commerceToken) {
                setError("You must be logged in to show interest in a web");
                console.error("You must be logged in to show interest in a web");
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${commerceToken}`;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/web/userInterested/${commerceCif}`); 

            if (response.data.error) {
                setError(response.data.error);
            } else {
                setInterested((prevInterested) => [...prevInterested, ...response.data]);
            }
        } catch (error) {
            console.error("Error fetching interested users:", error);
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="text-center mt-10">
            <h1 className="font-semibold text-lg">See all the users interested in your web</h1>
            <button
                onClick={handleSubmit}
                className="text-blue-700 border-2 border-solid border-blue-700 rounded-md p-2 mt-4 font-semibold hover:bg-blue-700 hover:text-white"
            >
                Show Interest
            </button>
            {interested.length > 0 && (
                <div className="mt-5">
                    <h1 className="mb-3 font-medium">Interested Users:</h1>
                    <ul className="list-disc list-inside">
                        {interested.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                    <p className="text-green-400 mt-3">Interest shown successfully!</p>
                </div>
            )}
            {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
    );
}