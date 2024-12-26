"use client";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundImage: "url('/images/home_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
      }}
      className="font-[Poppins]"
    >
      {/* Full-Screen Overlay */}
      <div className="bg-black bg-opacity-70 lg:rounded-xl lg:p-12 p-6 absolute inset-0 lg:inset-auto lg:max-w-5xl flex flex-col justify-center items-center">
        {/* Header */}
        <h1 className="font-extrabold text-5xl md:text-6xl mb-4 leading-tight">
          Find Your Perfect Home
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-200">
          Discover the ideal home tailored to your lifestyle and needs.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden shadow-md w-full max-w-3xl mb-8">
          <input
            type="text"
            placeholder="Enter location, state or city..."
            className="flex-grow p-4 text-gray-700 outline-none"
          />
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold transition duration-300"
            style={{ whiteSpace: "nowrap" }}
          >
            Search
          </button>
        </div>

        {/* Call to Action Button */}
        <button
          onClick={() => router.push("/listings")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300"
          style={{ marginTop: "20px" }}
        >
          Explore All Homes
        </button>
      </div>
    </div>
  );
}

export default HomePage;
