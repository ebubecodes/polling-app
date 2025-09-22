"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PollResultsChartProps {
  options: { id: string; text: string }[];
  votes: { id: string; option_id: string }[];
}

const COLORS = [
  "#6366f1", // indigo-500
  "#f59e42", // orange-400
  "#10b981", // emerald-500
  "#f43f5e", // rose-500
  "#3b82f6", // blue-500
  "#fbbf24", // yellow-400
  "#a78bfa", // purple-400
  "#f87171", // red-400
];

export function PollResultsChart({ options, votes }: PollResultsChartProps) {
  // Aggregate vote counts per option
  const data = options.map((option, idx) => ({
    name: option.text,
    value: votes.filter((v) => v.option_id === option.id).length,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Poll Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 14 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 14 }} />
            <Tooltip cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="value">
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
