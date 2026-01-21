'use client';

import { useState } from "react";
import axios from "axios";

export default function AddReview({ webId, onReviewAdded }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [respuesta, setRespuesta] = useState(null);
  const [review, setReview] = useState({
    scoring: 0,
    puntuacion: 0,
    texto: "",
  });

  const handleChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/writeReview/${webId}`, // Asume que la API está configurada para manejar esta ruta en Next.js
        review,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Review added successfully:", response.data);
      setRespuesta("Review added successfully");
      onReviewAdded(); // Notifica al componente padre que la reseña se agregó
    } catch (error) {
      console.error("Review failed:", error);
      setError("Review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="scoring" className="block font-medium text-gray-700">
            Scoring:
          </label>
          <input
            id="scoring"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="number"
            placeholder="Scoring"
            name="scoring"
            value={review.scoring}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="puntuacion" className="block font-medium text-gray-700">
            Puntuacion:
          </label>
          <input
            id="puntuacion"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            type="number"
            placeholder="Puntuacion"
            name="puntuacion"
            value={review.puntuacion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="texto" className="block font-medium text-gray-700">
            Review:
          </label>
          <textarea
            id="texto"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Texto"
            name="texto"
            value={review.texto}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-customTeal text-zinc-800 hover:bg-customTealDark p-2 rounded-lg"
        >
          {loading ? "Loading..." : "Add Review"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">Please Login to write a review</p>}
      {respuesta && <p className="text-green-500 mt-4">{respuesta}</p>}
    </div>
  );
}
