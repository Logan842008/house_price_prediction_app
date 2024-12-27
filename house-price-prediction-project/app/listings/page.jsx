"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { FaBed, FaBath, FaRulerCombined, FaCar, FaHome } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Listings() {
  const router = useRouter();
  const [fullData, setFullData] = useState([]); // Holds entire dataset for filtering
  const [filteredData, setFilteredData] = useState([]); // Holds the filtered results to display
  const [loading, setLoading] = useState(true);
  const [showSaved, setShowSaved] = useState(false); // Filter by saved properties

  // Filters state
  const [houseType, setHouseType] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [bedrooms, setBedrooms] = useState([0, 20]);
  const [bathrooms, setBathrooms] = useState([0, 20]);
  const [carSlots, setCarSlots] = useState([0, 10]);
  const [pricePerSqft, setPricePerSqft] = useState([0, 10000]);
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    fetch("/data/combined_property_data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const validData = result.data.filter((property) => {
              const hasAllFields = Object.values(property).every(
                (value) => value && value.trim() !== ""
              );
              const hasValidImages =
                property.Images &&
                property.Images.trim() !== "" &&
                property.Images.includes("https");
              return hasAllFields && hasValidImages;
            });
            setFullData(validData); // Store entire dataset
            setFilteredData(validData.slice(0, 48)); // Display initial 48
            setLoading(false);
            setSavedProperties(
              JSON.parse(localStorage.getItem("savedProperties")) || []
            );
          },
        });
      })
      .catch((error) => {
        console.error("Error loading CSV file:", error);
        setLoading(false);
      });
  }, []);

  const saveProperty = (property) => {
    const saved = [...savedProperties];
    const isAlreadySaved = saved.some((p) => p.Title === property.Title);

    if (isAlreadySaved) {
      const updatedSaved = saved.filter((p) => p.Title !== property.Title);
      setSavedProperties(updatedSaved);
      localStorage.setItem("savedProperties", JSON.stringify(updatedSaved));
    } else {
      saved.push(property);
      setSavedProperties(saved);
      localStorage.setItem("savedProperties", JSON.stringify(saved));
    }
  };

  const isPropertySaved = (property) => {
    return savedProperties.some((p) => p.Title === property.Title);
  };

  const applyFilters = () => {
    const filtered = (showSaved ? savedProperties : fullData).filter(
      (property) => {
        const price = parseFloat(property.Price) || 0;
        const priceSqft = parseFloat(property["Price per sqft"]) || 0;
        const bedroomCount = parseFloat(property.Bedrooms) || 0;
        const bathroomCount = parseFloat(property.Bathrooms) || 0;
        const carSlotCount = parseFloat(property["Car Slots"]) || 0;

        return (
          (!houseType || property["House Type"] === houseType) &&
          (!district || property.District === district) &&
          (!state || property.State === state) &&
          price >= priceRange[0] &&
          price <= priceRange[1] &&
          priceSqft >= pricePerSqft[0] &&
          priceSqft <= pricePerSqft[1] &&
          bedroomCount >= bedrooms[0] &&
          bedroomCount <= bedrooms[1] &&
          bathroomCount >= bathrooms[0] &&
          bathroomCount <= bathrooms[1] &&
          carSlotCount >= carSlots[0] &&
          carSlotCount <= carSlots[1]
        );
      }
    );
    setFilteredData(filtered.slice(0, 48)); // Display first 48 results
  };

  const resetFilters = () => {
    setHouseType("");
    setDistrict("");
    setState("");
    setPriceRange([0, 15000000]);
    setBedrooms([0, 20]);
    setBathrooms([0, 20]);
    setCarSlots([0, 10]);
    setPricePerSqft([0, 10000]);
    setFilteredData(fullData.slice(0, 48)); // Reset to initial 48 results
  };

  const viewDetails = (property) => {
    localStorage.setItem("propertyDetails", JSON.stringify(property));
    router.push(`/listings/${property.Title.replace(/\s+/g, "-")}`);
  };

  useEffect(() => {
    applyFilters();
  }, [
    houseType,
    district,
    state,
    priceRange,
    bedrooms,
    bathrooms,
    carSlots,
    pricePerSqft,
    showSaved,
    savedProperties,
  ]);

  const houseTypes = [...new Set(fullData.map((item) => item["House Type"]))];
  const districts = state
    ? [
        ...new Set(
          fullData
            .filter((item) => item.State === state)
            .map((item) => item.District)
        ),
      ]
    : [...new Set(fullData.map((item) => item.District))];
  const states = [...new Set(fullData.map((item) => item.State))];

  return (
    <div className="relative min-h-screen bg-gray-100 pt-14">
      <div className="container mx-auto p-6">
        <h1 className="text-6xl font-bold text-center text-gray-800 mb-8">
          Property Listings
        </h1>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showSaved ? "Show All Properties" : "Show Saved Properties"}
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 border rounded-lg bg-white shadow">
              {houseType || "Select House Type"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {houseTypes.map((type, idx) => (
                <DropdownMenuItem key={idx} onClick={() => setHouseType(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 border rounded-lg bg-white shadow">
              {district || "Select District"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {districts.map((dist, idx) => (
                <DropdownMenuItem key={idx} onClick={() => setDistrict(dist)}>
                  {dist}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 border rounded-lg bg-white shadow">
              {state || "Select State"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {states.map((st, idx) => (
                <DropdownMenuItem key={idx} onClick={() => setState(st)}>
                  {st}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <Slider
              min={0}
              max={15000000}
              step={10000}
              value={priceRange}
              onValueChange={(val) => setPriceRange(val)}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price per Sq. Ft.
            </label>
            <Slider
              min={0}
              max={10000}
              step={50}
              value={pricePerSqft}
              onValueChange={(val) => setPricePerSqft(val)}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <Slider
              min={0}
              max={20}
              step={1}
              value={bedrooms}
              onValueChange={(val) => setBedrooms(val)}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bathrooms
            </label>
            <Slider
              min={0}
              max={20}
              step={1}
              value={bathrooms}
              onValueChange={(val) => setBathrooms(val)}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Car Slots
            </label>
            <Slider
              min={0}
              max={10}
              step={1}
              value={carSlots}
              onValueChange={(val) => setCarSlots(val)}
              className="w-full mt-2"
            />
          </div>
        </div>

        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mb-6"
          onClick={resetFilters}
        >
          Reset Filters
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index}>
                  <Card className="overflow-hidden shadow-lg">
                    <div className="h-64 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded mt-4 animate-pulse"></div>
                    </div>
                  </Card>
                </Skeleton>
              ))
            : filteredData.map((property, index) => {
                const images = property.Images.split(",")
                  .map((url) => url.trim().replace(/^.*https/, "https"))
                  .filter((url) => url);

                const isSaved = isPropertySaved(property);

                return (
                  <Card
                    key={index}
                    className="overflow-hidden shadow-lg transition-all transform hover:scale-[102%]"
                  >
                    <div className="h-64 bg-gray-200">
                      {images.length > 0 ? (
                        <img
                          src={images[0].replace(/'$/, "")}
                          alt={`Property ${index}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-xl font-semibold text-gray-800 truncate">
                          {property.Price
                            ? `RM ${property.Price}`
                            : "Price N/A"}
                        </CardTitle>
                        <div className="text-sm text-gray-500 mt-1 truncate">
                          {property.Title || "No title provided"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {property.Location || "No location provided"}
                        </div>
                      </CardHeader>

                      <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-700 xl:mb-4 mb-0">
                        {property["House Type"] && (
                          <div className="flex col-span-2 xl:col-span-1 items-center whitespace-nowrap">
                            <FaHome className="mr-2 text-orange-500 text-lg" />
                            {property["House Type"]}
                          </div>
                        )}
                        {property.Size && (
                          <div className="flex col-span-2 xl:col-span-1 items-center whitespace-nowrap">
                            <FaRulerCombined className="mr-2 text-orange-500 text-lg" />
                            {parseFloat(property.Size)} sq.ft.
                          </div>
                        )}
                      </CardContent>

                      <CardContent className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                        {property.Bedrooms && (
                          <div className="flex items-center col-span-3 xl:col-span-1 whitespace-nowrap">
                            <FaBed className="mr-2 text-orange-500 text-lg" />
                            {parseFloat(property.Bedrooms)}
                          </div>
                        )}
                        {property.Bathrooms && (
                          <div className="flex items-center col-span-3 xl:col-span-1 whitespace-nowrap">
                            <FaBath className="mr-2 text-orange-500 text-lg" />
                            {parseFloat(property.Bathrooms)}
                          </div>
                        )}
                        {property["Car Slots"] && (
                          <div className="flex items-center col-span-3 lg:col-span-1 whitespace-nowrap">
                            <FaCar className="mr-2 text-orange-500 text-lg" />
                            {parseFloat(property["Car Slots"])}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="flex justify-between items-center mt-4">
                        <button
                          className={`text-sm py-2 px-4 rounded-lg transition-all duration-300 ${
                            isSaved
                              ? "bg-green-500 text-white"
                              : "text-orange-500 hover:text-white hover:bg-orange-400"
                          }`}
                          onClick={() => saveProperty(property)}
                        >
                          {isSaved ? "Saved" : "Save"}
                        </button>
                        <button
                          className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white py-2 px-4 rounded-lg text-sm"
                          onClick={() => viewDetails(property)}
                        >
                          View Details
                        </button>
                      </CardFooter>
                    </div>
                  </Card>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default Listings;
