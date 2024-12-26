"use client";

import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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

const RadarChartDashboard = () => {
  const [radarData, setRadarData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("");

  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/radar-data");
        const data = await response.json();

        setRadarData(data);

        // Automatically select the first column
        if (data.length > 0) {
          setSelectedColumn(data[0].column);
        }
      } catch (error) {
        console.error("Error fetching radar data:", error);
      }
    };

    fetchRadarData();
  }, []);

  const renderRadarChart = () => {
    if (!radarData || !selectedColumn) {
      return <p>No data available for the selected column.</p>;
    }

    // Filter the data for the selected column
    const chartData = radarData.filter(
      (item) => item.column === selectedColumn
    );

    if (chartData.length === 0) {
      return <p>No data available for the selected column.</p>;
    }

    return (
      <Card className="w-full md:p-4">
        <CardHeader>
          <CardTitle className="font-[Poppins]">
            Radar Chart for {selectedColumn}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis />
                <Tooltip />
                <Legend />
                <Radar
                  name="Min"
                  dataKey="min"
                  stroke="#FF0000" // Vibrant Red
                  fill="#FF0000"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Q1"
                  dataKey="q1"
                  stroke="#00FF00" // Vibrant Green
                  fill="#00FF00"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Median"
                  dataKey="median"
                  stroke="#0000FF" // Vibrant Blue
                  fill="#0000FF"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Q3"
                  dataKey="q3"
                  stroke="#FF7F00" // Bright Orange
                  fill="#FF7F00"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Max"
                  dataKey="max"
                  stroke="#8A2BE2" // Vivid Purple
                  fill="#8A2BE2"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Mean"
                  dataKey="mean"
                  stroke="#FF1493" // Bright Pink
                  fill="#FF1493"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 font-[Poppins]">
        Radar Chart Dashboard
      </h1>
      <div className="mb-4">
        <Select
          value={selectedColumn}
          onValueChange={setSelectedColumn}
          className="w-48 font-[Poppins]"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            {radarData &&
              Array.from(new Set(radarData.map((item) => item.column))).map(
                (column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
      </div>
      <div>{renderRadarChart()}</div>
    </div>
  );
};

export default RadarChartDashboard;
