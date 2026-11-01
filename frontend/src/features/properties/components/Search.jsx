"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { UsePropertyContext } from "@/features/properties/context/PropertyContext.jsx";
import { indianCities } from "@/data/indianCities.js";

function SearchFilter() {
  const [city, setCity] = useState("Delhi");
  const [rent, setRent] = useState(5000);
  const [propertyType, setPropertyType] = useState("1BHK");
  const { handleSearch } = UsePropertyContext();

  return (
    <div className="w-full flex justify-center px-2">
      <div className="w-full max-w-4xl bg-white border rounded-xl md:rounded-full shadow-sm p-3 md:p-1">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
          {/* WHERE */}
          <div className="flex flex-col md:px-5 md:flex-1">
            <span className="text-[11px] font-semibold text-gray-500">
              Where
            </span>

            <input
              list="indian-cities"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search any Indian city"
              className="outline-none text-xs text-gray-700 bg-transparent"
            />
            <datalist id="indian-cities">
              {indianCities.map((cityName) => (
                <option key={cityName} value={cityName} />
              ))}
            </datalist>
          </div>

          {/* divider desktop */}
          <div className="hidden md:block h-6 w-px bg-gray-200"></div>

          {/* BUDGET */}
          <div className="flex flex-col md:px-5 md:flex-1">
            <span className="text-[11px] font-semibold text-gray-500">
              Budget
            </span>
            <select
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="outline-none text-xs bg-transparent text-gray-700"
            >
              <option value="">{rent}</option>
              <option value="5000">Rs5000</option>
              <option value="10000">Rs10000</option>
              <option value="20000">Rs20000</option>
              <option value="30000">Rs30000</option>
              <option value="40000">Rs40000</option>
              <option value="50000">Rs50000</option>
            </select>
          </div>

          {/* divider desktop */}
          <div className="hidden md:block h-6 w-px bg-gray-200"></div>

          {/* Property Type */}
          <div className="flex flex-col md:px-5 md:flex-1">
            <span className="text-[11px] font-semibold text-gray-500">
              Type
            </span>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="outline-none text-xs bg-transpapropertyType text-gray-700"
            >
              <option value="">{propertyType}</option>

              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="room">room</option>
            </select>
          </div>
          {/* divider desktop */}
          <div className="hidden md:block h-6 w-px bg-gray-200"></div>

          {/* SEARCH BUTTON */}
          <button
            onClick={() => handleSearch(city, rent, propertyType)}
            className="mt-2 md:mt-0 md:ml-2 bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-2 px-4 py-2 md:p-3 rounded-lg md:rounded-full transition"
          >
            <Search size={16} />
            <span className="md:hidden text-sm">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
