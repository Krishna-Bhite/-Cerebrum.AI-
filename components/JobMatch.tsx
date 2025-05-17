"use client";
import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const JobMatch = ({ data }: { data: number }) => {
  const formattedData = [
    { name: "Job Match", value: data, fill: "#C3EBFA" },
    { name: "Other", value: 100 - data, fill: "#FAE27C" },
  ];
  return (
    <div className="w-full h-[100%] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">
          {Math.round(data) || 0}
        </h1>
        <p className="text-sm">of 100 marks</p>
      </div>
      <h1 className={`font-medium absolute bottom-16 max-md:bottom-8 left-0 right-0 m-auto text-center ${data < 40 ? "text-red-500" : data<70 ? "text-orange-500" : "text-green-500"}`}>{data < 40 ? "Very less chances of selection" : data<70 ? "Adequate chances of selection" : "High chances of selection"}</h1>
    </div>
  );
};

export default JobMatch;
