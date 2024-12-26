"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as d3 from "d3";

const CorrelationDashboard = () => {
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/correlation-data"
        );
        const data = await response.json();

        // Filter out unwanted columns and their corresponding matrix entries
        const excludedColumns = ["Unnamed: 0"];

        const filteredColumns = data.columns.filter(
          (col) => !excludedColumns.includes(col)
        );

        const filteredMatrix = {};
        filteredColumns.forEach((col) => {
          filteredMatrix[col] = {};
          filteredColumns.forEach((subCol) => {
            filteredMatrix[col][subCol] = data.matrix[col][subCol];
          });
        });

        setCorrelationData({
          columns: filteredColumns,
          matrix: filteredMatrix,
        });
      } catch (error) {
        console.error("Error fetching correlation data:", error);
      }
    };

    fetchCorrelationData();
  }, []);

  const renderCorrelationMatrix = () => {
    if (!correlationData) {
      return <p>Loading correlation data...</p>;
    }

    const { matrix, columns } = correlationData;

    // Create a d3 color scale using the RdBu palette
    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([1, -1]); // Reverse domain to align with Seaborn's coolwarm palette

    return (
      <Card className="w-full md:p-4">
        <CardHeader>
          <CardTitle className="font-[Poppins]">Correlation Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th
                    className="p-2 border border-gray-300 bg-gray-100 text-center"
                    style={{
                      width: "0px",
                      height: "0px",
                      fontWeight: "bold",
                    }}
                  >
                    Variables
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="p-2 border text-[13px] border-gray-300 bg-gray-100 text-center"
                      style={{
                        width: "8px",
                        height: "0px",
                        fontWeight: "bold",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {columns.map((row) => (
                  <tr key={row}>
                    <td
                      className="p-2 border border-gray-300 font-bold text-center text-[13px]"
                      style={{ width: "0px", height: "0px" }}
                    >
                      {row}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={`${row}-${col}`}
                        className="p-2 border border-gray-300 text-center"
                        style={{
                          width: "0px",
                          height: "0px",
                          backgroundColor: colorScale(matrix[row][col]),
                          color:
                            Math.abs(matrix[row][col]) > 0.5
                              ? "white"
                              : "black",
                        }}
                      >
                        {matrix[row][col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 font-[Poppins]">
      <h1 className="text-3xl font-bold mb-6">Correlation Dashboard</h1>
      {renderCorrelationMatrix()}
    </div>
  );
};

export default CorrelationDashboard;
