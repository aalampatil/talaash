"use client";

import React from "react";
import { UseAdminContext } from "@/features/admin/context/AdminContext.jsx";

function Dashboard() {
  const { totalUsers, totalProperties, totalLandlords } = UseAdminContext();

  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Total Properties", value: totalProperties },
    { label: "Total Landlords", value: totalLandlords },
  ];

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border border-black rounded-lg p-6 hover:bg-black hover:text-white transition"
          >
            <p className="text-sm uppercase tracking-wide">{stat.label}</p>
            <h2 className="text-3xl font-semibold mt-2">{stat.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
