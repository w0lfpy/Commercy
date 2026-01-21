'use client';

import { useState } from "react";
import axios from "axios";

export default function UploadImg() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [texts, setTexts] = useState(""); 

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const handleTextsChange = (event) => {
        setTexts(event.target.value); 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const commerceToken = localStorage.getItem("commerceToken");
        const commerceCif = localStorage.getItem("commerceCif")?.toLowerCase();

        if (!commerceToken) {
            setError("You must be logged in to upload an image");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            if (file) {
                formData.append("image", file);
            }
            formData.append("texts", texts);

            axios.defaults.headers.common["Authorization"] = `Bearer ${commerceToken}`;
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/web/${commerceCif}/upload-image`, 
                formData
            );

            if (response.data) {
                setResponse("Image and texts uploaded successfully");
            }
            console.log("Image and texts uploaded successfully:", response.data);
            setFile(null);
            setPreview(null);
            setTexts("");
        } catch (error) {
            console.error("Error details:", error);
            setError("An error occurred while uploading. Please try again later.");
        } finally {
            setLoading(false);
            if (!error) {
                setFile(null);
                setPreview(null);
                setTexts("");
            }
        }
    };

    return (
        <div className="flex flex-col">
            <h1 className="ml-5 mt-5 font-semibold">Upload Image and Texts</h1>
            <form className="ml-5 mt-5 flex flex-col" onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                />
                {preview && (
                    <img src={preview} alt="Preview" className="mt-5 max-w-xs max-h-36 rounded-md" />
                )}
                <textarea 
                    value={texts} 
                    onChange={handleTextsChange} 
                    placeholder="Enter words or texts separated by commas"
                    className="mt-5 mr-5 border rounded-md p-2"
                />
                <button
                    type="submit"
                    disabled={loading || (!file && !texts.trim())}
                    className="w-fit text-blue-700 border-2 border-solid border-blue-700 rounded-md mb-5 p-2 font-semibold hover:bg-blue-700 hover:text-white mt-2"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
                {error && <p className="text-red-700">{error}</p>}
                {response && <p className="text-green-700 mb-3">{response}</p>}
            </form>
        </div>
    );
}