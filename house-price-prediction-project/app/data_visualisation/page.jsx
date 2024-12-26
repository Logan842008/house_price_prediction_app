"use client";

import React, { useState } from "react";
import ScatterPlotDashboard from "./scatter-plot/page";
import CorrelationDashboard from "./correlation-plot/page";
import HistogramDashboard from "./histogram-plot/page";
import BarDataDashboard from "./bar-plot/page";
import LineDataDashboard from "./line-plot/page";
import RadarChartDashboard from "./radar-plot/page";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PieDashboard from "./pie-plot/page";

function DataVisualisationDashboard() {
  const [dropdownValue, setDropdownValue] = useState("histogram");

  const tabItems = [
    { value: "histogram", label: "Histogram" },
    { value: "scatter", label: "Scatter Plot" },
    { value: "bar", label: "Bar Chart" },
    { value: "line", label: "Line Chart" },
    { value: "radar", label: "Radar Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "correlation", label: "Correlation Matrix" },
  ];

  const handleDropdownChange = (e) => {
    setDropdownValue(e.target.value);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 pt-14">
      <div className="container mx-auto space-y-6 p-6">
        <h1 className="text-6xl font-bold text-center text-gray-800 font-[Poppins]">
          Data Visualisation Dashboard
        </h1>

        {/* Tabs for medium and larger screens */}
        <div className="hidden lg:block">
          <Tabs defaultValue={dropdownValue} className="w-full">
            <TabsList className="flex justify-center space-x-4 rounded-md p-2">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-lg px-4 font-[Poppins] py-2 rounded-lg bg-white hover:bg-gray-300 aria-selected:bg-blue-500 aria-selected:text-white"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabItems.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="bg-gray-100 p-6 h-full">
                  {tab.value === "histogram" && <HistogramDashboard />}
                  {tab.value === "scatter" && <ScatterPlotDashboard />}
                  {tab.value === "bar" && <BarDataDashboard />}
                  {tab.value === "line" && <LineDataDashboard />}
                  {tab.value === "radar" && <RadarChartDashboard />}
                  {tab.value === "pie" && <PieDashboard />}
                  {tab.value === "correlation" && <CorrelationDashboard />}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Dropdown for small screens */}
        <div className="block lg:hidden">
          <select
            value={dropdownValue}
            onChange={handleDropdownChange}
            className="w-full p-2 border rounded-md text-gray-800"
          >
            {tabItems.map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
          <div className="bg-white shadow-md rounded-lg p-6 mt-4 h-full">
            {dropdownValue === "histogram" && <HistogramDashboard />}
            {dropdownValue === "scatter" && <ScatterPlotDashboard />}
            {dropdownValue === "bar" && <BarDataDashboard />}
            {dropdownValue === "line" && <LineDataDashboard />}
            {dropdownValue === "radar" && <RadarChartDashboard />}
            {dropdownValue === "pie" && <PieDashboard />}
            {dropdownValue === "correlation" && <CorrelationDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataVisualisationDashboard;
