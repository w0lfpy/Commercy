'use client'

import { useState } from "react"
import {CreateWeb, UpdateWeb, UploadImg, InterestedWeb} from "@/components";

const dashboardWeb = [
    {
        name: "Create Web",
        component: <CreateWeb />,
    },
    {
        name: "Update Web",
        component: <UpdateWeb />,
    },
    {
        name: "Upload Image",
        component: <UploadImg />,
    },
    {
        name: "Interested Web",
        component: <InterestedWeb />,
    },
];

export default function CommerceDashboard() {
    
    const [selectedComponent, setSelectedComponent] = useState(dashboardWeb[0].name);

    const handleClick = (componentName) => {
        setSelectedComponent(componentName);
    }

    return (
        <div className="p-5 bg-gray-100 h-screen text-zinc-800">
            <div className="p-5 h-[95vh] w-full bg-white shadow-md rounded-lg">
                <h1 className="text-center font-semibold text-xl">COMMERCE DASHBOARD</h1>
                <div className="flex flex-row p-5">
                    <div className="flex flex-col h-fit w-[25%] bg-customTeal p-5 mr-2 rounded-xl shadow-md">
                        <div className="text-left">
                            {dashboardWeb.map((item, index) => (
                                <div key={index} className="mb-3 mt-3 font-semibold">
                                    <button onClick={() => handleClick(item.name)} className={`${selectedComponent === item.name ? "text-zinc-800" : "text-customTealDark"}`}>{item.name}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-[75%] h-full min-h-[200px] rounded-xl shadow-md bg-gray-100">
                        {dashboardWeb.find((item) => item.name === selectedComponent)?.component}
                    </div>
                </div>
            </div>
        </div>
    )
}