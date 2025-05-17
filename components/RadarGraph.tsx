'use client';
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";



const RadarGraph = ({data}:{data:any}) => {
  
  return (
    <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data}>
          <PolarGrid stroke="#444" strokeDasharray="4 4" />
          <PolarAngleAxis
            dataKey="subject"
            stroke="#ccc"
            tick={{ fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            stroke="#555"
            tick={{ fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Candidate"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.4}
            dot={true}
          />
        </RadarChart>
      </ResponsiveContainer>
  );
};

export default RadarGraph;
