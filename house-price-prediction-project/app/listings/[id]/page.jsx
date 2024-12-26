"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaHome,
} from "react-icons/fa";

function PropertyDetails({ params }) {
  const [property, setProperty] = useState(null);
  const [mortgage, setMortgage] = useState({
    loanAmount: 0,
    monthlyPayment: 0,
  });
  const [inputs, setInputs] = useState({
    price: 0,
    downPayment: 10,
    interestRate: 4,
    loanTerm: 30,
  });

  useEffect(() => {
    const storedProperty = JSON.parse(localStorage.getItem("propertyDetails"));
    setProperty(storedProperty);
    if (storedProperty) {
      setInputs((prev) => ({
        ...prev,
        price: parseFloat(storedProperty.Price),
      }));
    }
  }, []);

  useEffect(() => {
    if (inputs.price) {
      const loanAmount =
        inputs.price - (inputs.downPayment / 100) * inputs.price;
      const monthlyRate = inputs.interestRate / 100 / 12;
      const n = inputs.loanTerm * 12;
      const monthlyPayment =
        (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
      setMortgage({
        loanAmount,
        monthlyPayment: monthlyPayment.toFixed(2),
      });
    }
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const images = property.Images.split(",")
    .map((url) =>
      url
        .trim()
        .replace(/^.*https/, "https")
        .replace(/'$/, "")
    )
    .filter((url) => url)
    .slice(0, -1); // Exclude the last image

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          {property.Title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Carousel>
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`Property Image ${index + 1}`}
                      className="w-full max-h-[500px] object-cover rounded-lg shadow-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaHome className="text-blue-500" /> Property Details
              </h2>
              <div className="text-gray-600 space-y-4">
                <p className="text-3xl font-extrabold text-orange-600 mb-4">
                  RM {property.Price}
                </p>
                <p className="flex items-center gap-2">
                  <FaRulerCombined className="text-orange-500" />{" "}
                  <strong>Size:</strong> {property.Size} sq.ft.
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />{" "}
                  <strong>Location:</strong> {property.Location}
                </p>
                <p className="flex items-center gap-2">
                  <FaBed className="text-purple-500" />{" "}
                  <strong>Bedrooms:</strong> {property.Bedrooms}
                </p>
                <p className="flex items-center gap-2">
                  <FaBath className="text-blue-500" />{" "}
                  <strong>Bathrooms:</strong> {property.Bathrooms}
                </p>
                <p className="flex items-center gap-2">
                  <FaCar className="text-green-500" />{" "}
                  <strong>Car Slots:</strong> {property["Car Slots"]}
                </p>
                <p className="flex items-center gap-2">
                  <FaHome className="text-yellow-500" />{" "}
                  <strong>House Type:</strong> {property["House Type"]}
                </p>
                <p>
                  <strong>Price per Sq. Ft.:</strong> RM{" "}
                  {property["Price per sqft"]}
                </p>
                <p>
                  <strong>State:</strong> {property.State}
                </p>
                <p>
                  <strong>District:</strong> {property.District}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Facilities</h2>
          <div className="flex flex-wrap gap-4">
            {property.Facilities.slice(1, -1)
              .split(",")
              .map((facility, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {facility.trim().replace(/^['"]|['"]$/g, "")}
                </span>
              )) || <p className="text-gray-600">Not provided</p>}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Mortgage Calculator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Price (RM)
              </label>
              <input
                type="number"
                value={inputs.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="mt-2 p-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Down Payment (%)
              </label>
              <input
                type="number"
                value={inputs.downPayment}
                onChange={(e) =>
                  handleInputChange("downPayment", e.target.value)
                }
                className="mt-2 p-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={inputs.interestRate}
                onChange={(e) =>
                  handleInputChange("interestRate", e.target.value)
                }
                className="mt-2 p-2 border rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loan Term (Years)
              </label>
              <input
                type="number"
                value={inputs.loanTerm}
                onChange={(e) => handleInputChange("loanTerm", e.target.value)}
                className="mt-2 p-2 border rounded-lg w-full"
              />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-700">Results</h3>
            <p className="text-gray-600 mt-2">
              Loan Amount: RM {mortgage.loanAmount.toLocaleString()}
            </p>
            <p className="text-gray-600 mt-1">
              Monthly Payment: RM {mortgage.monthlyPayment.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default PropertyDetails;
