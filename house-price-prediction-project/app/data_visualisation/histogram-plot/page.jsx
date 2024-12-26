"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistogramDashboard = () => {
  const [histogramData, setHistogramData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("");

  const colorMap = {
    Bathrooms: "#8884d8", // Purple
    Bedrooms: "#82ca9d", // Green
    "Car Slots": "#ffc658", // Yellow
    Price: "#2a9df4", // Blue
    "Price per Bedroom": "#ff8042", // Orange
    "Price per sqft": "#a4de6c", // Lime Green
    "Room Density": "#d45087", // Pink
    Size: "#003f5c", // Dark Blue
  };

  useEffect(() => {
    const fetchHistogramData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/histogram-data"
        );
        const data = await response.json();

        // Filter out unwanted keys
        const filteredData = Object.fromEntries(
          Object.entries(data).filter(
            ([key]) =>
              ![
                "Unnamed: 0",
                "District_code",
                "Price_per_Sqft_Bins",
                "Size_Bins",
                "State",
                "Tenure",
                "Furnished Type",
                "House Type",
                "Room Density",
              ].includes(key)
          )
        );

        setHistogramData(filteredData);

        // Automatically select the first metric
        if (Object.keys(filteredData).length > 0) {
          setSelectedMetric(Object.keys(filteredData)[0]);
        }
      } catch (error) {
        console.error("Error fetching histogram data:", error);
      }
    };

    fetchHistogramData();
  }, []);

  const renderHistogramChart = () => {
    if (!histogramData || !selectedMetric || !histogramData[selectedMetric]) {
      return <p>No data available for the selected metric.</p>;
    }

    const { counts, bins, mean, median } = histogramData[selectedMetric];

    // Prepare data for the chart
    const chartData = bins.slice(0, -1).map((binStart, idx) => ({
      bin: `${Math.round(binStart)} - ${Math.round(bins[idx + 1])}`,
      count: counts[idx],
    }));

    return (
      <Card className="w-full p-4 ">
        <CardHeader>
          <CardTitle className="font-[Poppins]">
            Histogram for {selectedMetric}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>
              <strong>Mean:</strong> {mean.toFixed(2)} |{" "}
              <strong>Median:</strong> {median.toFixed(2)}
            </p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="bin"
                  angle={-20}
                  fontSize={13  }
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    position: "relative", // Make the position relative to the chart
                    marginTop: "10px", // Add space below the chart
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Count"
                  fill={colorMap[selectedMetric] || "#8884d8"} // Use dynamic color
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="">
      <div className="container mx-auto md:p-4 ">
        <h1 className="text-3xl font-bold mb-6 font-[Poppins]">
          Histogram Dashboard
        </h1>
        <div className="mb-4">
          <Select
            value={selectedMetric}
            onValueChange={setSelectedMetric}
            className="w-48"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              {histogramData &&
                Object.keys(histogramData).map((metric) => (
                  <SelectItem key={metric} value={metric}>
                    {metric}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>{renderHistogramChart()}</div>
      </div>
    </div>
  );
};

export default HistogramDashboard;
