'use client';

import { useState } from "react";
import {UpdateUserInfo} from "@/components";
import {CreateCommerce} from "@/components";
import {GetComercios} from "@/components";
import {UpdateCommerce} from "@/components";

export default function AdminInfo() {
  const [selectedCommerce, setSelectedCommerce] = useState(null);

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

  const [selectedComponent, setSelectedComponent] = useState(menuAdmin[0].name);

  const handleClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  return (
    <div className="p-5 bg-gray-100 h-full text-zinc-800">
      <div className="p-5 min-h-[90vh] h-full w-full bg-white shadow-md rounded-lg">
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
