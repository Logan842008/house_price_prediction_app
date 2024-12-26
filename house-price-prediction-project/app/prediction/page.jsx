"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Building, Car, Bath, Bed, Maximize, MapPin } from "lucide-react";

const PropertyPricePredictor = () => {
  // State definitions
  const [totalPriceRange, setTotalPriceRange] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({
    District: "",
    Bedrooms: 3,
    Bathrooms: 2,
    "Car Slots": 1,
    "House Type": "",
    Tenure: "",
    "Furnished Type": "",
    size: 1000,
  });
  const [facilities, setFacilities] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Constants
  const STATE_DISTRICTS = {
    johor: [
      "ayer hitam",
      "batu pahat",
      "gelang patah",
      "iskandar puteri (nusajaya)",
      "jeram batu",
      "johor bahru",
      "kluang",
      "kota tinggi",
      "kulai",
      "labis",
      "masai",
      "muar",
      "paloh",
      "pasir gudang",
      "pekan nenas",
      "pengerang",
      "perling",
      "permas jaya",
      "pontian",
      "sedenak",
      "senai",
      "serom",
      "skudai",
      "sri gading",
      "tampoi",
      "tangkak",
      "tebrau",
      "ulu tiram",
    ],
    kedah: [
      "alor setar",
      "bandar darulaman",
      "bedong",
      "bukit kayu hitam",
      "gurun",
      "jitra",
      "karangan",
      "kota kuala muda",
      "kuah",
      "kuala kedah",
      "kuala ketil",
      "kuala nerang",
      "kubang pasu",
      "kulim",
      "lunas",
      "padang meha",
      "padang serai",
      "pokok sena",
      "serdang",
      "sik",
      "sungai karangan",
      "sungai kob",
      "sungai lalang",
      "sungai petani",
      "temin",
    ],
    kelantan: ["bachok", "kota bharu", "machang"],
    "kuala lumpur": [
      "ampang",
      "bandar menjalara",
      "bandar tasik selatan",
      "bangsar",
      "batu caves",
      "brickfields",
      "bukit jalil",
      "bukit kiara",
      "bukit tunku (kenny hills)",
      "cheras",
      "country heights damansara",
      "damansara heights",
      "desa parkcity",
      "desa petaling",
      "dutamas",
      "gombak",
      "jalan ipoh",
      "jalan klang lama (old klang road)",
      "jalan kuching",
      "jinjang",
      "kampung kerinchi (bangsar south)",
      "kepong",
      "keramat",
      "kl city centre",
      "kl eco city",
      "kl sentral",
      "kuchai lama",
      "mont kiara",
      "pantai",
      "salak selatan",
      "salak south",
      "segambut",
      "sentul",
      "seputeh",
      "setapak",
      "setiawangsa",
      "sri hartamas",
      "sri petaling",
      "sungai besi",
      "sunway spk",
      "taman desa",
      "taman tun dr ismail",
      "titiwangsa",
      "ulu kelang",
      "wangsa maju",
    ],
    melaka: [
      "alai",
      "alor gajah",
      "ayer keroh",
      "ayer molek",
      "bachang",
      "balai panjang",
      "batu berendam",
      "bemban",
      "bertam",
      "bukit baru",
      "bukit katil",
      "bukit lintang",
      "cheng",
      "durian tunggal",
      "duyong",
      "jasin",
      "klebang",
      "krubong",
      "masjid tanah",
      "melaka city",
      "merlimau",
      "paya rumput",
      "selandar",
      "semabok",
      "sungei baru tengah",
      "sungei petai",
      "tanjong minyak",
      "ujong pasir",
    ],
    "negeri sembilan": [
      "bahau",
      "bandar enstek",
      "bandar sri sendayan",
      "bukit kepayang",
      "jimah",
      "kuala pilah",
      "labu",
      "lenggeng",
      "lukut",
      "mantin",
      "nilai",
      "pasir panjang",
      "port dickson",
      "rantau",
      "rasah",
      "senawang",
      "seremban",
      "seremban 2",
      "seremban jaya",
      "sikamat",
      "teluk kemang",
    ],
    pahang: [
      "bentong",
      "beserah",
      "cameron highlands",
      "hulu telom",
      "karak",
      "kuantan",
      "mentakab",
      "muadzam shah",
      "pekan",
      "penor",
      "sungai karang",
      "temerloh",
    ],
    penang: [
      "ayer itam",
      "balik pulau",
      "batu feringghi",
      "batu kawan",
      "batu maung",
      "bayan baru",
      "bayan lepas",
      "bukit jambul",
      "bukit mertajam",
      "bukit minyak",
      "butterworth",
      "gelugor",
      "george town",
      "gurney",
      "jelutong",
      "juru",
      "kepala batas",
      "kubang semang",
      "nibong tebal",
      "perai",
      "pulau tikus",
      "seberang jaya",
      "seberang perai",
      "simpang ampat",
      "sungai ara",
      "sungai dua",
      "sungai jawi",
      "tanjung bungah",
      "tanjung tokong",
      "tasek gelugor",
      "teluk kumbar",
    ],
    perak: [
      "bagan serai",
      "batu gajah",
      "bidor",
      "bota",
      "chemor",
      "gopeng",
      "ipoh",
      "kampar",
      "kamunting",
      "kuala kangsar",
      "kuala kurau",
      "lahat",
      "lumut",
      "menglembu",
      "parit buntar",
      "selama",
      "seri iskandar",
      "simpang",
      "simpang pulai",
      "sitiawan",
      "sungai siput",
      "taiping",
      "tambun",
      "tanjong rambutan",
      "tanjung malim",
      "teluk intan",
      "tronoh",
      "ulu kinta",
    ],
    perlis: ["kangar"],
    putrajaya: ["presint 11", "presint 18", "presint 8", "putrajaya"],
    sabah: [
      "beaufort",
      "kota kinabalu",
      "papar",
      "penampang",
      "sandakan",
      "tawau",
      "tuaran",
    ],
    sarawak: ["bintulu", "kuching", "miri", "samarahan"],
    selangor: [
      "ampang",
      "ara damansara",
      "balakong",
      "bandar kinrara",
      "bandar sri damansara",
      "bandar sungai long",
      "bandar utama",
      "bangi",
      "banting",
      "batang berjuntai",
      "batu arang",
      "batu caves",
      "beranang",
      "bukit raja",
      "cheras",
      "cyberjaya",
      "damansara damai",
      "damansara perdana",
      "dengkil",
      "glenmarie",
      "gombak",
      "hulu langat",
      "ijok",
      "jenjarom",
      "kajang",
      "kapar",
      "kayu ara",
      "kepong",
      "kerling",
      "klang",
      "kota damansara",
      "kuala selangor",
      "kuang",
      "mutiara damansara",
      "petaling jaya",
      "port klang (pelabuhan klang)",
      "puchong",
      "puchong perdana",
      "puncak alam",
      "rawang",
      "sabak bernam",
      "saujana",
      "saujana utama",
      "selayang",
      "semenyih",
      "sentul",
      "sepang",
      "serendah",
      "seri kembangan",
      "setia alam",
      "shah alam",
      "subang",
      "subang jaya",
      "sungai buloh",
      "sunway",
      "tanjong duabelas",
      "tanjong karang",
      "telok panglima garang",
      "tropicana",
      "ulu kelang",
      "ulu langat",
    ],
    terengganu: [
      "banggul",
      "bukit payung",
      "dungun",
      "kemaman",
      "kertih",
      "kuala paka",
      "kuala terengganu",
    ],
  };

  const HOUSE_TYPES = [
    "1-sty terrace/link house",
    "1.5-sty terrace/link house",
    "2-sty terrace/link house",
    "2.5-sty terrace/link house",
    "3-sty terrace/link house",
    "3.5-sty terrace/link house",
    "4-sty terrace/link house",
    "4.5-sty terrace/link house",
    "apartment",
    "bungalow",
    "cluster house",
    "condominium",
    "flat",
    "semi-detached house",
    "serviced residence",
    "townhouse",
  ];

  const TENURE_TYPES = [
    "freehold",
    "leasehold",
    "malay reserved land",
    "private lease scheme",
  ];
  const FURNISHED_TYPES = [
    "fully furnished",
    "partly furnished",
    "unfurnished",
  ];

  const FACILITY_LIST = [
    "24-Hour Security",
    "Air Conditioner",
    "Badminton Court",
    "Balcony",
    "Basketball Court",
    "Bath Tub",
    "Bbq",
    "Business Centre",
    "Cafe",
    "Clubhouse",
    "Garden",
    "Gym",
    "Jacuzzi",
    "Jogging Track",
    "Kitchen Cabinet",
    "Nursery",
    "Parking",
    "Playground",
    "Retail Stores",
    "Salon",
    "Sauna",
    "Squash Court",
    "Swimming Pool",
    "Tennis Courts",
    "Wading Pool",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFacilities((prev) => ({ ...prev, [facility]: !prev[facility] }));
  };

  const handleSubmit = async () => {
    try {
      // Reset error state
      setError(null);

      // Create base request data
      let requestData = {
        ...formData,
        Bedrooms: parseInt(formData.Bedrooms),
        Bathrooms: parseInt(formData.Bathrooms),
        "Car Slots": parseInt(formData["Car Slots"]),
        size: parseInt(formData.size),
      };

      // Add facilities with boolean values
      FACILITY_LIST.forEach((facility) => {
        requestData[facility] = facilities[facility] ? 1 : 0;
      });

      // Map categorical values to indices
      requestData = {
        ...requestData,
        District: formData.District
          ? STATE_DISTRICTS[selectedState].indexOf(formData.District)
          : 0,
        "House Type": HOUSE_TYPES.indexOf(formData["House Type"]),
        Tenure: TENURE_TYPES.indexOf(formData.Tenure),
        "Furnished Type": FURNISHED_TYPES.indexOf(formData["Furnished Type"]),
      };

      // Make the API request
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch prediction");
      }

      // Parse the response
      const data = await response.json();

      // Calculate total price range
      const pricePerSqFt = data.price_per_sqft;
      const totalPrice = pricePerSqFt * formData.size;
      const minPrice = formData.size * (pricePerSqFt - 80.95);
      const maxPrice = formData.size * (pricePerSqFt + 80.95);

      // Update states
      setPrediction({
        pricePerSqFt: pricePerSqFt,
        totalPrice: totalPrice,
      });
      setTotalPriceRange({
        min: minPrice,
        max: maxPrice,
      });
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setPrediction(null);
      setTotalPriceRange(null); // Clear price range on error
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pt-14">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 font-[Poppins]">
          Property Price Predictor
        </h1>

        <Card className="shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <h3>Location</h3>
                </div>
                <Select
                  onValueChange={(value) => setSelectedState(value)}
                  value={selectedState || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select State">
                      {selectedState
                        ? selectedState.replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )
                        : "Select State"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATE_DISTRICTS).map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="capitalize"
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    handleInputChange("District", value)
                  }
                  value={formData.District || ""}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select District">
                      {formData["District"]
                        ? formData["District"].replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )
                        : "Select District"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {selectedState &&
                      STATE_DISTRICTS[selectedState].map((district) => (
                        <SelectItem
                          key={district}
                          value={district}
                          className="capitalize"
                        >
                          {district}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="w-5 h-5 text-orange-500" />
                  <h3>Property Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Bed className="w-4 h-4 text-orange-500" />
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.Bedrooms}
                      onChange={(e) =>
                        handleInputChange("Bedrooms", e.target.value)
                      }
                      className="border-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Bath className="w-4 h-4 text-orange-500" />
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.Bathrooms}
                      onChange={(e) =>
                        handleInputChange("Bathrooms", e.target.value)
                      }
                      className="border-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Car className="w-4 h-4 text-orange-500" />
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={formData["Car Slots"]}
                      onChange={(e) =>
                        handleInputChange("Car Slots", e.target.value)
                      }
                      className="border-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded-lg">
                    <Maximize className="w-4 h-4 text-orange-500" />
                    <Input
                      type="number"
                      min="100"
                      value={formData.size}
                      onChange={(e) =>
                        handleInputChange("size", e.target.value)
                      }
                      className="border-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Building className="w-5 h-5 text-orange-500" />
                  <h3>Property Type</h3>
                </div>
                <Select
                  onValueChange={(value) =>
                    handleInputChange("House Type", value)
                  }
                  value={formData["House Type"] || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select House Type">
                      {formData["House Type"]
                        ? formData["House Type"].replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )
                        : "Select House Type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {HOUSE_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => handleInputChange("Tenure", value)}
                  value={formData.Tenure || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Tenure">
                      {formData["Tenure"]
                        ? formData["Tenure"].replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )
                        : "Select Tenure Type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TENURE_TYPES.map((tenure) => (
                      <SelectItem
                        key={tenure}
                        value={tenure}
                        className="capitalize"
                      >
                        {tenure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    handleInputChange("Furnished Type", value)
                  }
                  className="capitalize"
                  value={formData["Furnished Type"] || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Furnished Type">
                      {formData["Furnished Type"]
                        ? formData["Furnished Type"].replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )
                        : "Select Furnished Type"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {FURNISHED_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Facilities */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {FACILITY_LIST.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={facility}
                      checked={facilities[facility] || false}
                      onCheckedChange={() => handleFacilityToggle(facility)}
                    />
                    <label htmlFor={facility} className="text-sm capitalize">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full mt-8 py-6 text-lg font-semibold rounded-lg transform transition-all hover:scale-[1.01]"
              onClick={handleSubmit}
            >
              Calculate Price
            </Button>

            {prediction && (
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 text-white">
                    <h4 className="text-lg font-medium text-orange-100">
                      Price per sq ft
                    </h4>
                    <p className="text-4xl font-bold mt-2">
                      RM {prediction.pricePerSqFt.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 text-white">
                    <h4 className="text-lg font-medium text-orange-100">
                      Total Price
                    </h4>
                    <p className="text-4xl font-bold mt-2">
                      RM{" "}
                      {prediction.totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                {totalPriceRange && (
                  <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                    <p className="text-sm font-medium">
                      Note: This predictor is approximately{" "}
                      <strong>60% accurate</strong>. The actual price can vary
                      between:
                    </p>
                    <ul className="mt-2 list-disc list-inside">
                      <li>
                        Minimum:{" "}
                        <strong>
                          RM{" "}
                          {totalPriceRange.min.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </li>
                      <li>
                        Maximum:{" "}
                        <strong>
                          RM{" "}
                          {totalPriceRange.max.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </li>
                    </ul>
                    <p className="mt-2">
                      Please consider these variations when interpreting the
                      results.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyPricePredictor;
