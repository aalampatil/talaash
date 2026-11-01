"use client";


import { UseAdminContext } from "@/features/admin/context/AdminContext";

function AllProperties() {
  const { allProperties } = UseAdminContext();

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">All Properties</h1>

      <div className="border border-black rounded-lg overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-black">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Location</th>
              <th className="p-4">Type</th>
              <th className="p-4">Rent</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {allProperties.map((property) => (
              <tr
                key={property._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="p-4">{property.title}</td>
                <td className="p-4">
                  {property.location?.city}, {property.location?.area}
                </td>
                <td className="p-4">{property.propertyType}</td>
                <td className="p-4">₹{property.rent}</td>
                <td className="p-4 capitalize">{property.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllProperties;
