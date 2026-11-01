"use client";

import React from "react";
import { UseLandlordContext } from "@/features/landlord/context/LandlordContext.jsx";

function LandlordVisits() {
  const { manageVisits, approveVisit, rejectVisit } = UseLandlordContext();

  if (!manageVisits || manageVisits.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-xl">
        No visits to show .
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Visits</h1>
        <span className="text-sm text-gray-500">
          {manageVisits.length} requests
        </span>
      </div>

      <div className="space-y-4">
        {manageVisits.map((visit) => (
          <div
            key={visit._id}
            className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div>
                <p className="font-semibold text-gray-800">
                  {visit.tenantName || "Tenant Name"}
                </p>
                <p className="text-gray-600 text-sm">{visit.tenantEmail}</p>
              </div>
              <div>
                <p className="text-gray-700">
                  Property:{" "}
                  <span className="font-medium">{visit.propertyTitle}</span>
                </p>
                <p className="text-gray-700">
                  Date: <span className="font-medium">{visit.date}</span>
                </p>
                <p className="text-gray-700">
                  Time: <span className="font-medium">{visit.time}</span>
                </p>
                <p className="text-gray-700 capitalize">
                  Status: <span className="font-medium">{visit.status}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex gap-2">
              <button
                onClick={() => approveVisit(visit._id)}
                disabled={visit.status !== "pending"}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Approve
              </button>
              <button
                onClick={() => rejectVisit(visit._id)}
                disabled={visit.status !== "pending"}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandlordVisits;
