"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const PieDashboard = () => {
  const [pieData, setPieData] = useState(null);
  const [selectedHouseType, setSelectedHouseType] = useState("");

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d45087",
    "#003f5c",
    "#bc5090",
    "#ffa600",
    "#546e7a",
    "#00acc1",
    "#f4511e",
    "#3949ab",
    "#7e57c2",
    "#ffb300",
    "#8e24aa",
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#e377c2",
    "#17becf",
    "#393e46",
    "#00adb5",
    "#ff5722",
    "#ff9800",
    "#3f51b5",
    "#4caf50",
    "#009688",
    "#9c27b0",
    "#e91e63",
    "#3b3b98",
    "#ff6f61",
    "#c5e1a5",
    "#d81b60",
    "#0097a7",
    "#ffd740",
    "#ab47bc",
    "#43a047",
    "#7b1fa2",
    "#0d47a1",
    "#bf360c",
    "#00c853",
    "#9e9d24",
    "#ad1457",
    "#1b5e20",
    "#880e4f",
    "#3e2723",
    "#795548",
    "#c2185b",
    "#8e24aa",
    "#e65100",
    "#3e2723",
  ];

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/pie-data");
        const data = await response.json();
        setPieData(data);

        // Automatically select the first house type if data is available
        const firstHouseType = Object.keys(data)[0];
        if (firstHouseType) {
          setSelectedHouseType(firstHouseType);
        }
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchPieData();
  }, []);

  const renderPieCharts = () => {
    if (!pieData || !selectedHouseType || !pieData[selectedHouseType]) {
      return <p>No data available for the selected house type.</p>;
    }

    return Object.keys(pieData[selectedHouseType]).map((category, index) => {
      const chartData =
        pieData[selectedHouseType][category]?.labels.map((label, idx) => ({
          name: label,
          value: pieData[selectedHouseType][category].values[idx],
        })) || [];

      const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

      // Sort chartData by value in descending order
      const sortedChartData = [...chartData].sort((a, b) => b.value - a.value);

      // Shuffle colors to randomize starting point
      const randomizedColors = shuffleArray([...colors]);

      return (
        <Card key={index} className="w-full p-4 mb-6">
          <CardHeader>
            <CardTitle className="font-[Poppins]">
              Distribution for {selectedHouseType} by {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/2 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sortedChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={false} // Disable labels on the pie chart
                    >
                      {sortedChartData.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={randomizedColors[idx % randomizedColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2">
                <table className="table-auto w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2">
                        {category}
                      </th>
                      <th className="border border-gray-200 px-4 py-2">
                        Color
                      </th>
                      <th className="border border-gray-200 px-4 py-2">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedChartData.map((entry, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border border-gray-200 px-4 py-2 capitalize">
                          {entry.name}
                        </td>
                        <td
                          className="border border-gray-200 px-4 py-2"
                          style={{
                            backgroundColor:
                              randomizedColors[idx % randomizedColors.length],
                          }}
                        ></td>
                        <td className="border border-gray-200 px-4 py-2">
                          {((entry.value / totalValue) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className="container mx-auto md:p-4 ">
      <h1 className="text-3xl font-bold mb-6 font-[Poppins]">
        Pie Chart Dashboard
      </h1>
      <div className="mb-4">
        <Select
          value={selectedHouseType}
          onValueChange={setSelectedHouseType}
          className="w-48"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select House Type" />
          </SelectTrigger>
          <SelectContent>
            {pieData &&
              Object.keys(pieData).map((houseType) => (
                <SelectItem key={houseType} value={houseType}>
                  {houseType}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>{renderPieCharts()}</div>
    </div>
  );
};

export default PieDashboard;
