"use client";

import React, { useEffect } from "react";
import { FaSearch, FaChartLine, FaHome, FaCheck } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const PurposeSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  const features = [
    {
      icon: <FaSearch className="text-purple-500 text-6xl mb-6" />,
      title: "Explore Properties",
      description:
        "Discover thousands of properties with accurate listings, detailed descriptions, and high-quality images.",
      benefits: [
        "Advanced search filters",
        "Virtual tours available",
        "Neighborhood insights",
        "Price history tracking",
      ],
    },
    {
      icon: <FaChartLine className="text-green-500 text-6xl mb-6" />,
      title: "Data Insights",
      description:
        "Access market trends, price history, and predictions to make smarter decisions.",
      benefits: [
        "Market trend analysis",
        "Price predictions",
        "Investment calculators",
        "Comparative market data",
      ],
    },
    {
      icon: <FaHome className="text-blue-500 text-6xl mb-6" />,
      title: "Close the Deal",
      description:
        "Our tools and resources simplify closing the deal, ensuring a smooth experience.",
      benefits: [
        "Document management",
        "Progress tracking",
        "Professional network",
        "Transaction support",
      ],
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-full mx-auto">
        <h2
          className="text-6xl font-bold text-gray-800 mb-4 text-center"
          data-aos="fade-up"
        >
          Our Purpose
        </h2>
        <p
          className="text-2xl text-gray-600 max-w-4xl text-center mx-auto mb-16 leading-relaxed"
          data-aos="fade-up"
        >
          At <span className="text-orange-500 font-bold">PropertySigma</span>,
          our goal is to empower buyers and sellers by providing comprehensive
          tools, accurate data, and insights that simplify real estate
          transactions and decision-making processes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg"
              data-aos="flip-left"
            >
              <div
                className="flex flex-col items-center text-center mb-6"
                data-aos="fade-up"
              >
                {feature.icon}
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
              <ul className="space-y-3" data-aos="fade-up">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center">
                    <FaCheck className="text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="bg-orange-500 text-white rounded-lg p-12 text-center"
          data-aos="fade-up"
        >
          <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers who have found their perfect
            property match.
          </p>
          <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurposeSection;
