"use client";
import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";


const COLORS = ["#aff582", "#eb4444"];


const AtsResult = ({score}:{score:number}) => {
    const data = [
        { name: "ATS Score", value: score },
        { name: "Other", value: 100 - score },
    ];
  return (
    <div className="w-full h-[70%] relative">
      <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          innerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
      <span className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-bold text-3xl">{score}%</span>
    </div>
  );
};

export default AtsResult;
