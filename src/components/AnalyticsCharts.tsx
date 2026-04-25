"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { DifficultyLevel, SubmissionPayload } from "@/features/types";

export function AnalyticsCharts({
  submissions,
}: {
  submissions: Array<Pick<SubmissionPayload, "status" | "assignment">>;
}) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-slate-400 text-sm text-center py-4">
        Not enough data to generate analytics.
      </div>
    );
  }

  // Calculate Acceptance Rate
  const accepted = submissions.filter((s) => s.status === "accepted").length;
  const needsImprovement = submissions.filter(
    (s) => s.status === "needs_improvement",
  ).length;
  const pending = submissions.filter((s) => s.status === "pending").length;

  const pieData = [
    { name: "Accepted", value: accepted },
    { name: "Needs Improvement", value: needsImprovement },
    { name: "Pending", value: pending },
  ].filter((d) => d.value > 0);

  const COLORS = ["#4ade80", "#fb7185", "#facc15"];

  // Calculate Difficulty vs Submissions
  const difficultyMap: Record<DifficultyLevel, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  };
  submissions.forEach((s) => {
    const diff = s.assignment?.difficulty;
    if (diff) {
      difficultyMap[diff] = (difficultyMap[diff] || 0) + 1;
    }
  });

  const barData = (Object.keys(difficultyMap) as DifficultyLevel[]).map(
    (key) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      Count: difficultyMap[key],
    }),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-[#151025] rounded-2xl shadow border border-slate-800/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Submission Status
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A142B",
                  borderColor: "#332759",
                  color: "#fff",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#151025] rounded-2xl shadow border border-slate-800/60 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Submissions by Difficulty
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#332759"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A142B",
                  borderColor: "#332759",
                  color: "#fff",
                  borderRadius: "8px",
                }}
                cursor={{ fill: "#1A142B" }}
              />
              <Bar dataKey="Count" fill="#c026d3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
