"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tenantApi } from "@/features/tenant/services/tenant.api";
import { useTenantContext } from "@/features/tenant/context/TenantContext";

const defaultPreferences = {
  householdType: "single",
  city: "",
  location: "",
  minBudget: 1000,
  maxBudget: 100000,
  propertyType: "1BHK",
};

const TenantProfile = () => {
  const { tenantProfile, fetchTenant } = useTenantContext();
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState(defaultPreferences);

  const profile = tenantProfile?.profile;
  const preferences = tenantProfile?.preferences;

  useEffect(() => {
    setFormData({
      ...defaultPreferences,
      ...(preferences || {}),
    });
  }, [preferences]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "minBudget" || name === "maxBudget" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await tenantApi.updatePreferences(formData);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchTenant();
        setEdit(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not update preferences");
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-3xl border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p className="text-sm text-gray-600">{profile.email}</p>
            {profile.phone && (
              <p className="text-sm text-gray-600">{profile.phone}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => (edit ? handleSave() : setEdit(true))}
            className="border border-black px-4 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            {edit ? "Save" : "Edit"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <Field label="Household Type">
            {edit ? (
              <select
                name="householdType"
                value={formData.householdType}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="single">Single</option>
                <option value="family">Family</option>
                <option value="room">Room</option>
              </select>
            ) : (
              <ReadValue value={formData.householdType} />
            )}
          </Field>

          <Field label="Property Type">
            {edit ? (
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded"
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
              </select>
            ) : (
              <ReadValue value={formData.propertyType} />
            )}
          </Field>

          <Field label="City">
            {edit ? (
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded"
              />
            ) : (
              <ReadValue value={formData.city} />
            )}
          </Field>

          <Field label="Location">
            {edit ? (
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded"
              />
            ) : (
              <ReadValue value={formData.location} />
            )}
          </Field>

          <Field label="Minimum Budget">
            {edit ? (
              <input
                type="number"
                name="minBudget"
                value={formData.minBudget}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded"
              />
            ) : (
              <ReadValue value={`Rs ${formData.minBudget}`} />
            )}
          </Field>

          <Field label="Maximum Budget">
            {edit ? (
              <input
                type="number"
                name="maxBudget"
                value={formData.maxBudget}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded"
              />
            ) : (
              <ReadValue value={`Rs ${formData.maxBudget}`} />
            )}
          </Field>
        </div>
      </div>
    </div>
  );
};

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function ReadValue({ value }) {
  return (
    <span className="min-h-10 border border-gray-200 rounded p-2 capitalize text-gray-700">
      {value || "Not set"}
    </span>
  );
}

export default TenantProfile;
