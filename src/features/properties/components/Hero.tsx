"use client";


import { UseUserContext } from "@/features/auth/context/UserContext";
import Link from "next/link";
import { useEffect,useState } from "react";

function HeroSection() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const { authStatus, becomeLandlord, user } = UseUserContext();

  useEffect(() => {
    const show = localStorage.getItem("showDisclaimer");

    if (!show) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("showDisclaimer", "true");
    setShowDisclaimer(false);
  };

  return (
    <section className="w-full min-h-[90vh] px-3 py-3 flex items-center">
      {showDisclaimer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white max-w-lg w-[90%] border border-black rounded-xl p-8 shadow-xl">
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>

            {/* Content */}
            <p className="text-gray-700 text-sm leading-relaxed">
              Talaash is a rental property listing platform designed to connect
              tenants with property owners. The platform currently facilitates
              property discovery and communication between users.
            </p>

            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              As of <span className="font-medium">v1.0.0</span>, Talaash does
              not perform property verification or manage rental transactions.
              Future updates will introduce verification and move-in workflows
              to improve trust and safety across the platform.
            </p>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClose}
                className="border border-black px-5 py-2 text-sm hover:bg-black hover:text-white transition rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-5">
        {/* LEFT CONTENT */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-black tracking-tight">
            talaash
          </h1>

          <p className="mt-4 text-xl md:text-2xl text-red-900 font-medium">
            the search ends here
          </p>

          <p className="mt-4 text-sm md:text-lg text-red-900 max-w-lg">
            Find your next home with ease. Explore verified properties, discover
            the perfect neighborhood, and make your move with confidence.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href={"/filter-properties"}
              className="bg-red-900 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
            >
              Explore Homes
            </Link>

            {authStatus && user?.role === "tenant" ? (
              <button
                type="button"
                onClick={becomeLandlord}
                className="border border-red-600 text-red-900 px-6 py-3 rounded-lg font-medium hover:bg-red-100 transition"
              >
                List Your Property
              </button>
            ) : authStatus && user?.role === "landlord" ? (
              <Link
                href="/dashboard/landlord"
                className="border border-red-600 text-red-900 px-6 py-3 rounded-lg font-medium hover:bg-red-100 transition"
              >
                List Your Property
              </Link>
            ) : (
              <Link
                href="/login/landlord"
                className="border border-red-600 text-red-900 px-6 py-3 rounded-lg font-medium hover:bg-red-100 transition"
              >
                List Your Property
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=75"
            alt="home"
            fetchPriority="high"
            className="w-full max-w-md md:max-w-lg rounded-2xl shadow-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
