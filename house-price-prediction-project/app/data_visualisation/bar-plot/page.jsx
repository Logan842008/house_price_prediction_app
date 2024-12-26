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

const BarDataDashboard = () => {
  const [barData, setBarData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Define a color map for dynamic bar colors
  const colorMap = {
    State: "#2a9df4", // Purple
    Tenure: "#82ca9d", // Green
    "Furnished Type": "#ffc658", // Yellow
    "House Type": "#ff8042", // Orange
  };

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/bar-data");
        const data = await response.json();

        // Set the default selected category to the first key in the response
        setBarData(data);
        if (Object.keys(data).length > 0) {
          setSelectedCategory(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error("Error fetching bar data:", error);
      }
    };

    fetchBarData();
  }, []);

  const renderBarChart = () => {
    if (!barData || !selectedCategory || !barData[selectedCategory]) {
      return <p>No data available for the selected category.</p>;
    }

    const { categories, averages, counts } = barData[selectedCategory];

    // Prepare data for the chart
    const chartData = categories.map((category, idx) => ({
      category,
      average: averages[idx],
      count: counts[idx],
    }));

    return (
      <Card className="w-full md:p-4">
        <CardHeader>
          <CardTitle className="font-[Poppins]">
            Price per sqft vs {selectedCategory}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 100, left: 20 }} // Add extra bottom margin
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  angle={-20}
                  fontSize={13}
                  textAnchor="end" // Align the text properly
                  interval={0} // Ensure all labels are shown
                  tickMargin={10} // Add extra space between labels and the axis
                />
                <YAxis />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    position: "relative", // Make the position relative to the chart
                    marginTop: "80px", // Add space below the chart
                  }}
                />
                <Bar
                  dataKey="average"
                  fill={colorMap[selectedCategory] || "#8884d8"} // Dynamic color based on category
                  name="Average Price per sqft"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 font-[Poppins]">
        Bar Data Dashboard
      </h1>
      <div className="mb-4">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-48"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {barData &&
              Object.keys(barData).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>{renderBarChart()}</div>
    </div>
  );
};

export default BarDataDashboard;
