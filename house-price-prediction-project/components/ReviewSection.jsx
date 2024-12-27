"use client";

import React, { useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const ReviewsSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  const reviews = [
    {
      name: "Kannan",
      title: "First-time Homebuyer",
      review:
        "HomePricePro made my home search so easy! The data was incredibly helpful and accurate. The market analysis tools helped me understand pricing in different neighborhoods, and the mortgage calculator was a lifesaver. I couldn't ask for a better experience!",
      rating: 5,
      date: "March 2024",
      location: "San Francisco, CA",
    },
    {
      name: "Ughaswari",
      title: "Real Estate Investor",
      review:
        "The insights and tools provided are top-notch. I found exactly what I needed, and the market analytics helped me make confident decisions. The ROI calculator and investment analysis features are particularly impressive. I've used this platform for multiple properties now.",
      rating: 4.5,
      date: "February 2024",
      location: "Austin, TX",
    },
    {
      name: "Gundu",
      title: "Property Seller",
      review:
        "Amazing platform! HomePricePro made selling my home straightforward and stress-free. The comparative market analysis was spot-on, helping me price my property correctly. I particularly loved the professional photography services and virtual tour features.",
      rating: 5,
      date: "March 2024",
      location: "Seattle, WA",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "50,000+" },
    { label: "Properties Sold", value: "25,000+" },
    { label: "Cities Covered", value: "100+" },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return (
      <div className="flex justify-center">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-400 text-2xl" />
        ))}
        {halfStars === 1 && (
          <FaStarHalfAlt className="text-yellow-400 text-2xl" />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar
            key={`empty-${index}`}
            className="text-yellow-400 text-2xl"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-6xl font-bold text-gray-800 mb-4 text-center"
          data-aos="fade-up"
        >
          Customer Reviews
        </h2>
        <p
          className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto"
          data-aos="fade-up"
        >
          Don't just take our word for it. See what our valued customers have to
          say about their experience with HomePricePro.
        </p>

        <div
          className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 mb-16"
          data-aos="fade-up"
        >
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center h-full"
              data-aos="zoom-in"
            >
              <div className="mb-6">{renderStars(item.rating)}</div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                "{item.review}"
              </p>
              <div className="mt-auto">
                <h4 className="text-xl font-semibold text-gray-800 mb-1">
                  {item.name}
                </h4>
                <p className="text-orange-500 font-medium mb-2">{item.title}</p>
                <p className="text-sm text-gray-600">
                  {item.location} • {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="bg-orange-500 rounded-lg p-12 text-white"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="border-r last:border-0 border-orange-400"
                data-aos="flip-left"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
