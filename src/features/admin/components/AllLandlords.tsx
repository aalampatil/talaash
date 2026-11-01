"use client";


import { UseAdminContext } from "@/features/admin/context/AdminContext";

function AllLandlords() {
  const { allLandlords } = UseAdminContext();

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">All Landlords</h1>

      <div className="border border-black rounded-lg overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="border-b border-black">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
            </tr>
          </thead>

          <tbody>
            {allLandlords.map((landlord) => (
              <tr
                key={landlord._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="p-4">{landlord.name}</td>
                <td className="p-4">{landlord.email}</td>
                <td className="p-4">{landlord.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllLandlords;
