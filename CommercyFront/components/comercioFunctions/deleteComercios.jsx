'use client';

import React, { useState } from "react";
import axios from "axios";
import PopupDelete from "../deletePermanetly";

export default function DeleteCommerce({ commerceData }) {
    const [showPopup, setShowPopup] = useState(false);
    const [response, setResponse] = useState(null);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("You must be logged in to delete a commerce");
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.delete(`http://localhost:3000/api/comercios/${commerceData.cif}`); 
            console.log("Commerce deleted:", response.data);
            if (response.data.error) {
                setResponse(response.data.error);
                return;
            } else {
                setResponse("Commerce deleted successfully");
            }
            setShowPopup(false);
        } catch (error) {
            console.error("Error deleting commerce:", error);
        }
    };

    return (
        <div>
            <button
                onClick={() => setShowPopup(true)}
                className="text-red-700 border-2 border-solid border-red-700 rounded-md p-2 font-semibold hover:bg-red-700 hover:text-white"
            >
                Delete Commerce
            </button>
            {showPopup && (
                <PopupDelete
                    message={`Are you sure you want to delete commerce with CIF: ${commerceData.cif}?`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowPopup(false)}
                />
            )}
            {response && <p className="text-green-700 font-semibold">{response}</p>}
        </div>
    );
}
