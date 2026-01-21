'use client';

import Link from "next/link";

export default function WebItem({ web }) {
  const firstImage = Array.isArray(web.imagenes)
    ? `${process.env.NEXT_PUBLIC_API_URL}` + web.imagenes[0]
    : 'https://via.placeholder.com/150';

  const titulo = web.titulo
    ? web.titulo.charAt(0).toUpperCase() + web.titulo.slice(1).toLowerCase()
    : 'Sin título';

  const ciudad = web.ciudad
    ? web.ciudad.charAt(0).toUpperCase() + web.ciudad.slice(1).toLowerCase()
    : 'Sin ciudad';

  const actividad = web.actividad
    ? web.actividad.charAt(0).toUpperCase() + web.actividad.slice(1).toLowerCase()
    : 'Sin actividad';

  return (
    <Link href={`/${web._id}`} className="no-underline cursor-pointer text-zinc-800">
      <div className="flex items-center justify-between p-4 rounded-lg shadow-md hover:bg-gray-100 transition-transform duration-300 ease-in-out hover:-translate-y-1 my-4">
        <img
          src={firstImage}
          alt={titulo}
          className="w-24 h-24 object-cover rounded-md mr-4"
        />
        <div className="flex-grow">
          <h3 className="m-0 text-gray-800">{titulo}</h3>
          <p className="my-1 text-gray-800">{ciudad}</p>
          <p className="my-1 text-gray-800">{actividad}</p>
        </div>
        {/* <Link
          href={`/${web._id}`}
          className="no-underline cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-full hover:-translate-y-1 transition-transform duration-300"
        >
          More Info
        </Link> */}
      </div>
    </Link>
  );
}
