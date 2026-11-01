"use client";


import { UseLandlordContext } from "@/features/landlord/context/LandlordContext";
import { useState } from "react";

const amenitiesList = [
  "WiFi",
  "Air Conditioning",
  "Heating",
  "Parking",
  "Pool",
  "Gym",
  "Elevator",
  "Furnished",
  "Pet Friendly",
  "Security",
];

const propertyTypes = ["1BHK", "2BHK", "3BHK", "room"];

const AddProperty = () => {
  const { createLandlordProperty } = UseLandlordContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    city: "",
    area: "",
    address: "",
    propertyType: "1BHK",
    status: "available",
    amenities: [] as string[],
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle amenities
  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, amenities: [...prev.amenities, value] };
      } else {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== value),
        };
      }
    });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviews(previews);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "amenities") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, String(formData[key as keyof typeof formData]));
      }
    });

    images.forEach((img) => data.append("images", img));

    try {
      await createLandlordProperty(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white border-t border-red-950 rounded-full">
      <form
        onSubmit={handleSubmit}
        className="bg-transparent opacity-90  shadow-xl rounded-md p-8 w-full space-y-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
          Add New Property
        </h1>

        {/* Property Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Property Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Property Title"
              value={formData.title}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
              required
            />
            <input
              name="rent"
              type="number"
              placeholder="Monthly Rent"
              min={0}
              max={5000000}
              value={formData.rent}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
              required
            />
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
            >
              {propertyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
            >
              <option>available</option>
              <option>occupied</option>
            </select>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
            />
            <input
              name="area"
              placeholder="Area"
              value={formData.area}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
            />
            <input
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              className="border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950"
            />
          </div>
        </section>

        {/* Amenities */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg cursor-pointer hover:bg-red-100"
              >
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                  className="accent-blue-500"
                />
                <span className="text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">Description</h2>
          <textarea
            name="description"
            placeholder="Describe your property in detail"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-neutral-300 p-3 rounded-lg focus:ring-2 focus:ring-red-950  hover:border-red-950 min-h-[120px]"
          />
        </section>

        {/* Image Upload */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">
            Property Images
          </h2>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
            <label className="text-gray-500 cursor-pointer">
              Click or drag images here (max 10)
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <div className="grid grid-cols-3 gap-4 mt-4 w-full">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-50 bg-black text-white py-3 rounded-md transition font-semibold text-lg"
        >
          Add Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
