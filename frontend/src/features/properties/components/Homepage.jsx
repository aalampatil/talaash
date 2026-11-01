"use client";

import React from "react";
import PopularHomes from "@/features/properties/components/PropertySlider.jsx";
import HeroSection from "@/features/properties/components/Hero.jsx";

function Homepage() {
  return (
    <div>
      <HeroSection />
      <PopularHomes />
    </div>
  );
}

export default Homepage;
