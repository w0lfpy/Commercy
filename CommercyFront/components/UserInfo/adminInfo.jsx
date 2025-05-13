'use client';

import { useState } from "react";
import UpdateUserInfo from "./userInfo";
import CreateCommerce from "../comercioFunctions/createComercios";
import GetComercios from "../comercioFunctions/getComercios";
import UpdateCommerce from "../comercioFunctions/updateComercios";

export default function AdminInfo({ initialData }) {
  const [selectedCommerce, setSelectedCommerce] = useState(initialData || null);
  const [selectedComponent, setSelectedComponent] = useState("Update Admin Account");

  const menuAdmin = [
    {
      name: "Update Admin Account",
      component: <UpdateUserInfo />
    },
    {
      name: "Get Commerces",
      component: (
        <GetComercios
          onSelectCommerce={(commerce) => {
            setSelectedCommerce(commerce);
            setSelectedComponent("Update Commerce");
          }}
        />
      )
    },
    {
      name: "Create Commerce",
      component: <CreateCommerce />
    },
    {
      name: "Update Commerce",
      component: <UpdateCommerce commerceData={selectedCommerce} />
    }
  ];

  const handleClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  return (
    <div className="p-5 bg-gray-100 h-screen">
      <div className="p-5 h-[95vh] w-full bg-white shadow-md rounded-lg">
        <h1 className="text-center font-semibold text-xl">ADMIN DASHBOARD</h1>
        <div className="flex flex-row p-5">
          <div className="flex flex-col h-fit w-[25%] bg-customTeal p-5 mr-2 rounded-xl shadow-md">
            <div className="text-left">
              {menuAdmin.map((item, index) => (
                <div key={index} className="mb-3 mt-3 font-semibold">
                  <button
                    onClick={() => handleClick(item.name)}
                    className={`${
                      selectedComponent === item.name
                        ? "text-zinc-800"
                        : "text-customTealDark"
                    }`}
                  >
                    {item.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[75%] h-full min-h-[200px] rounded-xl shadow-md bg-gray-100">
            {menuAdmin.find((item) => item.name === selectedComponent)?.component}
          </div>
        </div>
      </div>
    </div>
  );
}
