"use client";

import React from "react";
import { UseAdminContext } from "@/features/admin/context/AdminContext.jsx";

function AllUsers() {
  const { allUsers } = UseAdminContext();

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">All Users</h1>

      <div className="border border-black rounded-lg overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="border-b border-black">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsers;
