"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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

const LineDataDashboard = () => {
  const [lineData, setLineData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("");

  const colorMap = {
    Bathrooms: "#2a9df4", // Blue
    Bedrooms: "#f72585", // Pink
    "Car Slots": "#4361ee", // Indigo
    Tenure: "#4895ef", // Light Indigo
  };

  useEffect(() => {
    const fetchLineData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/line-data");
        const data = await response.json();

        setLineData(data);
        if (Object.keys(data).length > 0) {
          setSelectedMetric(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error("Error fetching line data:", error);
      }
    };

    fetchLineData();
  }, []);

  const renderLineChart = () => {
    if (!lineData || !selectedMetric || !lineData[selectedMetric]) {
      return <p>No data available for the selected metric.</p>;
    }

    const { x, y, name } = lineData[selectedMetric];

    const chartData = x.map((label, index) => ({
      label,
      price: y[index],
    }));

    return (
      <Card className="w-full md:p-4">
        <CardHeader>
          <CardTitle className="font-[Poppins]">
            Distribution of Price per sqft by {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 100, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  tickMargin={10}
                />
                <YAxis />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    position: "relative", // Make the position relative to the chart
                    marginTop: "80px", // Add space below the chart
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={colorMap[selectedMetric] || "blue"}
                  name="Price per sqft"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 font-[Poppins]">
        Line Data Dashboard
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
            {lineData &&
              Object.keys(lineData).map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>{renderLineChart()}</div>
    </div>
  );
};

export default LineDataDashboard;
