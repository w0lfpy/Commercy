'use client';

import { useState, useEffect } from "react";
import WebDetails from "./webDetails/webDetails";
import TextInput from "./textInput";
import WebItem from "./webCard/webItem";

export default function GetAllWebsClient({ initialData }) {
    const [webs, setWebs] = useState(initialData || []);
    const [filteredWebs, setFilteredWebs] = useState(initialData || []);
    const [selectedWeb, setSelectedWeb] = useState(null);
    const [cityFilter, setCityFilter] = useState('');
    const [activityFilter, setActivityFilter] = useState('');
    const [sortByScore, setSortByScore] = useState(false);

    useEffect(() => {
        let results = [...webs];

        if (cityFilter || activityFilter) {
            const lowerCityFilter = cityFilter.toLowerCase();
            const lowerActivityFilter = activityFilter.toLowerCase();

            results = results.filter(web =>
                web.ciudad.toLowerCase().includes(lowerCityFilter) &&
                web.actividad.toLowerCase().includes(lowerActivityFilter)
            );
        }

        if (sortByScore) {
            results = results.map(web => {
                const reseñas = web.reseñas || [];
                const totalScoring = reseñas.reduce((acc, reseña) => acc + (reseña.scoring || 0), 0);
                const averageScoring = reseñas.length > 0 ? totalScoring / reseñas.length : 0;

                return {
                    ...web,
                    averageScoring
                };
            });

            // Ordenar por la media de scoring (descendente)
            results.sort((a, b) => b.averageScoring - a.averageScoring);
        }

        setFilteredWebs(results);
    }, [webs, cityFilter, activityFilter, sortByScore]);

    const handleUrl = () => {
        setSelectedWeb(null);
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-100 w-full text-zinc-800">
            {!selectedWeb && (
                <>
                    <div className="flex-col h-fit justify-start items-start filters md:col-span-1 bg-customTeal p-4 rounded shadow mt-4">
                        <h2 className="text-lg font-semibold mb-4">Webs Filter</h2>
                        <TextInput
                            placeholder="Filter by city"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                        <TextInput
                            placeholder="Filter by activity"
                            value={activityFilter}
                            onChange={(e) => setActivityFilter(e.target.value)}
                        />
                        <button
                            onClick={() => setSortByScore(!sortByScore)}
                            className="mt-4 w-full text-zinc-800 py-2 border-2 border-solid border-zinc-800 rounded hover:bg-gray-700 hover:text-white transition"
                        >
                            {sortByScore ? 'Remove sort' : 'Sort by Scoring'}
                        </button>
                    </div>
                    <div className="web-list md:col-span-3 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">All Webs</h2>
                        <p className="text-gray-600 mb-4">Explore all the webs available</p>
                        {filteredWebs.map((web, index) => (
                            <WebItem key={index} web={web} onSelect={() => setSelectedWeb(web)} />
                        ))}
                    </div>
                </>
            )}

            {selectedWeb && (
                <WebDetails data={selectedWeb} handleUrl={handleUrl} />
            )}
        </div>
    );
}

// 'use client';

// import { useState, useEffect } from "react";
// import WebDetails from "./webDetails/webDetails";
// import TextInput from "./textInput";
// import WebItem from "./webCard/webItem";

// export default function GetAllWebsClient({ initialData }) {
//     const [webs, setWebs] = useState(initialData || []);
//     const [filteredWebs, setFilteredWebs] = useState(initialData || []);
//     const [selectedWeb, setSelectedWeb] = useState(null);
//     const [cityFilter, setCityFilter] = useState('');
//     const [activityFilter, setActivityFilter] = useState('');
//     const [sortByScore, setSortByScore] = useState(false);

//     useEffect(() => {
//         let sortedWebs = [...webs];
//         if (sortByScore) {
//             sortedWebs.sort((a, b) => b.scoring - a.scoring);
//         }
//         setFilteredWebs(sortedWebs);
//     }, [sortByScore, webs]);

//     useEffect(() => {
//         const lowerCityFilter = cityFilter.toLowerCase();
//         const lowerActivityFilter = activityFilter.toLowerCase();

//         const filteredResults = webs.filter(web =>
//             web.ciudad.toLowerCase().includes(lowerCityFilter) &&
//             web.actividad.toLowerCase().includes(lowerActivityFilter)
//         );

//         setFilteredWebs(filteredResults);
//     }, [cityFilter, activityFilter, webs]);

//     const handleUrl = () => {
//         setSelectedWeb(null);
//     };

//     return (
//         <div className=" p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-100 w-full text-zinc-800">
//             {!selectedWeb && (
//                 <>
//                     <div className="flex-col h-fit justify-start items-start filters md:col-span-1 bg-customTeal p-4 rounded shadow mt-4">
//                         <h2 className="text-lg font-semibold mb-4">Webs Filter</h2>
//                         <TextInput
//                             placeholder="Filter by city"
//                             value={cityFilter}
//                             onChange={(e) => setCityFilter(e.target.value)}
//                         />
//                         <TextInput
//                             placeholder="Filter by activity"
//                             value={activityFilter}
//                             onChange={(e) => setActivityFilter(e.target.value)}
//                         />
//                         <button
//                             onClick={() => setSortByScore(!sortByScore)}
//                             className="mt-4 w-full text-zinc-800 py-2 border-2 border-solid border-zinc-800 rounded hover:bg-gray-700 hover:text-white transition"
//                         >
//                             {sortByScore ? 'Remove sort' : 'Sort by Scoring'}
//                         </button>
//                     </div>
//                     <div className="web-list md:col-span-3 p-4 rounded">
//                         <h2 className="text-xl font-semibold mb-2">All Webs</h2>
//                         <p className="text-gray-600 mb-4">Explore all the webs available</p>
//                         {filteredWebs.map((web, index) => (
//                             <WebItem key={index} web={web} onSelect={() => setSelectedWeb(web)} />
//                         ))}
//                     </div>
//                 </>
//             )}

//             {selectedWeb && (
//                 <WebDetails data={selectedWeb} handleUrl={handleUrl} />
//             )}
//         </div>
//     );
// }