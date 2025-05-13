'use client';

import { useState } from "react";
import axios from "axios";
import PopupDelete from "../deletePermanetly";

export default function DeleteWeb() {
    const [showPopup, setShowPopup] = useState(false);
    const [isSoftDelete, setIsSoftDelete] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setError(null); 
        try {
            const commerceToken = localStorage.getItem("commerceToken");
            const commerceCif = localStorage.getItem("commerceCif")?.toLowerCase();

            if (!commerceToken) {
                setError("You must be logged in to delete a web");
                return;
            }

            axios.defaults.headers.common["Authorization"] = `Bearer ${commerceToken}`;
            console.log(`Deleting web with CIF: ${commerceCif}, Soft Delete: ${isSoftDelete}`);
            const response = await axios.delete(
                `http://localhost:3000/api/web/${commerceCif}?soft=${isSoftDelete ? "True" : "False"}` 
            );

            if (response.data.error) {
                setError(response.data.error);
            } else {
                console.log("Web deleted successfully:", response.data);
                setShowPopup(false);
            }
        } catch (error) {
            console.error("Error deleting web:", error);

            if (error.response) {
                setError(error.response.data.error || "An error occurred on the server.");
            } else if (error.request) {
                setError("Cannot connect to the server. Please try again later.");
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className="ml-5 mt-2">
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isSoftDelete}
                    onChange={() => setIsSoftDelete(!isSoftDelete)}
                    className="w-4 h-4"
                />
                Soft Delete
            </label>
            <button
                onClick={() => setShowPopup(true)}
                className="text-red-700 border-2 border-solid border-red-700 rounded-md mb-5 p-2 font-semibold hover:bg-red-700 hover:text-white mt-2"
            >
                Delete Web
            </button>
            {showPopup && (
                <PopupDelete
                    message={`Are you sure you want to ${isSoftDelete ? "archive" : "delete"} this web?`}
                    onConfirm={handleSubmit}
                    onCancel={() => setShowPopup(false)}
                />
            )}
            {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>
    );
}