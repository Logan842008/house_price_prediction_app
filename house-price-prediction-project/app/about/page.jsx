"use client";

import React, { useEffect } from "react";
import AOS from "aos"; // Import AOS for animations
import "aos/dist/aos.css"; // Import AOS styles
import AboutSection from "../../components/AboutSection";
import ReviewsSection from "../../components/ReviewSection";
import PurposeSection from "../../components/PurposeSection";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Animation occurs only once while scrolling
    });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
      <div className="p-6">
        <section className="w-full max-w-7xl text-center mb-12">
          <AboutSection />
        </section>

        <section className="w-full max-w-7xl text-center mb-12">
          <PurposeSection />
        </section>

        <section className="w-full max-w-7xl text-center">
          <ReviewsSection />
        </section>
      </div>
    </div>
  );
};

export default About;
