"use client";


import { useTenantContext } from "@/features/tenant/context/TenantContext";

function TenantVisits() {
  const { visits, cancelVisit } = useTenantContext();

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold">My Visits</h1>
        <span className="text-sm text-gray-500">{visits.length} scheduled</span>
      </div>

      {visits?.length === 0 && (
        <div className="min-h-[300px] flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-500">
          No visits scheduled yet.
        </div>
      )}

      <div className="space-y-4">
        {visits.map((visit) => (
          <div
            key={visit._id}
            className="w-full border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="font-semibold">
                {visit.propertyId?.title || "Property"}
              </p>
              <p className="text-sm text-gray-600">
                {visit.propertyId?.location?.city || "City"},{" "}
                {visit.propertyId?.location?.area || "Area"}
              </p>
              <p className="text-sm">Rs {visit.propertyId?.rent}</p>
            </div>

            <div className="text-sm text-gray-700">
              {new Date(visit.visitDate).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-3">
              <span className="border border-black px-3 py-1 text-sm capitalize">
                {visit.status}
              </span>
              {visit.status !== "completed" && visit.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => cancelVisit(visit._id)}
                  className="text-sm border border-red-700 text-red-700 px-3 py-1 hover:bg-red-700 hover:text-white transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TenantVisits;
