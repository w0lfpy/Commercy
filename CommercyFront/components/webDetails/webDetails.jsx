'use client';

import { useState } from "react";
import AddReview from "./addReview";

export default function WebDetailsClient({ webData }) {
    const [web, setWeb] = useState(webData);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const totalImages = Array.isArray(web.imagenes) ? web.imagenes.length : 0;
    const totalReviews = Array.isArray(web.reseñas) ? web.reseñas.length : 0;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex - 1 + totalImages) % totalImages
        );
    };

    const renderStars = (scoring) => {
        const fullStars = Math.floor(scoring);
        const halfStar = scoring - fullStars >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <i key={`full-${i}`} className="fas fa-star text-yellow-500"></i>
                ))}
                {halfStar === 1 && <i className="fas fa-star-half-alt text-yellow-500"></i>}
                {[...Array(emptyStars)].map((_, i) => (
                    <i key={`empty-${i}`} className="far fa-star text-yellow-500"></i>
                ))}
            </>
        );
    };

    const handleAddReview = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/web/${web._id}`);
        const updatedData = await res.json();
        setWeb(updatedData);
        setIsPopupOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 text-zinc-800 p-4 font-sans">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
                <h3 className="text-3xl font-semibold text-center mb-4">{web.titulo}</h3>

                <div className="flex items-center space-x-4 text-center text-gray-600">
                    <div className="flex flex-col items-center">
                        <img src="/Img/maps.png" alt="Location" className="w-8 h-8" />
                        <p>{web.ciudad}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src="/Img/activity.png" alt="Activity" className="w-8 h-8" />
                        <p>{web.actividad}</p>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-lg flex items-center justify-center">
                    {totalImages > 0 ? (
                        <div className="flex items-center w-full justify-center relative">
                            <button className="absolute left-0 text-gray-500 hover:text-gray-700 px-2 z-10" onClick={prevImage}>◀</button>

                            <img
                                className="max-w-md w-[600px] h-[300px] object-cover transition-transform duration-3000 ease transform rounded-[10px] z-20"
                                src={`${process.env.NEXT_PUBLIC_API_URL}` + web.imagenes[currentImageIndex]}
                                alt=""
                            />

                            <button className="absolute right-0 text-gray-500 hover:text-gray-700 px-2 z-10" onClick={nextImage}>▶</button>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No images available</p>
                    )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xl font-medium">Web Reviews</h4>
                        <button
                            className="bg-customTeal text-zinc-800 font-medium py-2 px-4 rounded-lg hover:bg-customTealDark"
                            onClick={() => setIsPopupOpen(true)}
                        >
                            Add Review
                        </button>
                    </div>
                    {totalReviews > 0 ? (
                        <div className="mt-4 space-y-4">
                            {web.reseñas.map((reseña, index) => (
                                <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                                    {/* <p>Scoring: {renderStars(reseña.scoring)}</p> */}
                                    <p className="text-gray-600">Scoring: {reseña.scoring}</p>
                                    <p className="text-gray-600">Puntuación: {reseña.puntuacion}</p>
                                    <p className="text-gray-600">Comentario: {reseña.texto}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-4">No hay reseñas disponibles.</p>
                    )}
                </div>
                <button
                    className="w-full py-3 mt-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-auto h-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                            onClick={() => setIsPopupOpen(false)}
                        >
                            ✖
                        </button>
                        <AddReview webId={web._id} onReviewAdded={handleAddReview} />
                    </div>
                </div>
            )}
        </div>
    );
}