"use client";

import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
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

const ScatterPlotDashboard = () => {
  const [scatterData, setScatterData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("Size");

  // Define a color map for dynamic color assignment
  const colorMap = {
    Bathrooms: "#8884d8", // Purple
    Bedrooms: "#82ca9d", // Green
    "Car Slots": "#ffc658", // Yellow
    "Price per Bedroom": "#ff8042", // Orange
    "Room Density": "#d45087", // Pink
    Size: "#003f5c", // Dark Blue
  };

  useEffect(() => {
    const fetchScatterData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/scatter-data");
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
              ].includes(key)
          )
        );

        setScatterData(filteredData);
      } catch (error) {
        console.error("Error fetching scatter data:", error);
      }
    };

    fetchScatterData();
  }, []);

  const renderScatterPlot = () => {
    if (!scatterData || !scatterData[selectedMetric]) {
      return <p>No data available for {selectedMetric}.</p>;
    }

    const dataPoints = scatterData[selectedMetric].x.map((x, i) => ({
      x,
      y: scatterData[selectedMetric].y[i],
    }));

    if (dataPoints.length === 0) {
      return <p>No data points to display for {selectedMetric}.</p>;
    }

    return (
      <Card className="w-full md:p-4">
        <CardHeader>
          <CardTitle className="font-[Poppins]">
            Price per sqft vs {selectedMetric}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis dataKey="x" name={selectedMetric} type="number" />
                <YAxis dataKey="y" name="Price per sqft" type="number" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Scatter
                  name={`${selectedMetric} vs Price per sqft`}
                  data={dataPoints}
                  fill={colorMap[selectedMetric] || "#8884d8"} // Default color if no match
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 font-[Poppins]">
        Scatter Data Dashboard
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
            {scatterData &&
              Object.keys(scatterData).map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>{renderScatterPlot()}</div>
    </div>
  );
};

export default ScatterPlotDashboard;
