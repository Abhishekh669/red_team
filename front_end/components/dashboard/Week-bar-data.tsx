import React from "react";
import { ChartDataPoint } from "./student-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WeeKBarData({ chartData }: { chartData: ChartDataPoint[] }) {
  // Function to calculate the grade on a 1-10 scale

  return (
    <Card className="bg-slate-950 w-full text-white">
      <CardContent className="w-full h-full  ">
        <div style={{ width: "102%", height: 400 }}>
          <ResponsiveContainer className="w-full">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />{" "}
              {/* Adjusted grid color */}
              <XAxis
                dataKey="date"
                stroke="#ffffff" // White text for X-axis
                tick={{ fill: "#ffffff" }} // White text for ticks
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="#ffffff" // White text for Y-axis
                tick={{ fill: "#ffffff" }} // White text for ticks
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="grade"
                stroke="#ef4444" // Red line color
                strokeWidth={2}
                dot={{ r: 6, fill: "#ef4444" }} // Red dots
                activeDot={{ r: 8, fill: "#ef4444" }} // Red active dots
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
     
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-slate-950 p-3 border border-red-600 rounded shadow-sm text-white">
        <p className="font-medium text-red-600">
          {format(new Date(data.rawDate), "PPP")}
        </p>
        <p className="text-sm">
          Score: {data.score}/{data.totalMarks}
        </p>
        <p className="text-sm">Pass Marks: {data.passMarks}</p>
        <p className="text-sm">
          Status:{" "}
          <span className={data.isPassed ? "text-green-500" : "text-red-500"}>
            {data.isPassed ? "Passed" : "Failed"}
          </span>
        </p>
        <p className="text-sm">Grade: {data.grade}</p>
      </div>
    );
  }
  return null;
}

export default WeeKBarData;
