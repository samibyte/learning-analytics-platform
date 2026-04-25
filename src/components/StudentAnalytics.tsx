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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import { AssignmentPayload, SubmissionPayload } from "@/features/types";

interface StudentAnalyticsProps {
  assignments: AssignmentPayload[];
  submissions: SubmissionPayload[];
}

export function StudentAnalytics({
  assignments,
  submissions,
}: StudentAnalyticsProps) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="bg-[#151025] rounded-2xl border border-slate-800/60 p-12 text-center">
        <p className="text-slate-400">No data available yet to generate analytics. Start by exploring assignments!</p>
      </div>
    );
  }

  // 1. Completion Data (Donut Chart)
  const accepted = submissions.filter((s) => s.status === "accepted").length;
  const pending = submissions.filter((s) => s.status === "pending").length;
  const notStarted = assignments.length - submissions.length;
  const needsImprovement = submissions.filter((s) => s.status === "needs_improvement").length;

  const completionData = [
    { name: "Accepted", value: accepted, color: "#4ade80" },
    { name: "Pending", value: pending, color: "#facc15" },
    { name: "Needs Improvement", value: needsImprovement, color: "#fb7185" },
    { name: "Not Started", value: Math.max(0, notStarted), color: "#332759" },
  ].filter(d => d.value > 0);

  // 2. Momentum Data (Cumulative Submissions over time)
  // Since we don't have historical data in the payload besides basically just the count for now,
  // we'll mock growth based on actual counts to show "recent momentum" if possible.
  // Actually, SubmissionPayload has createdAt? Let's check models.
  // Assuming we have dates, let's group by date.
  const momentumData = submissions
    .sort((a, b) => 
      parseInt(a._id.toString().substring(0, 8), 16) - 
      parseInt(b._id.toString().substring(0, 8), 16)
    )
    .map((s, i) => ({
      name: `Submission ${i + 1}`,
      count: i + 1,
    }));

  // If no submissions, show empty state for momentum
  const displayMomentum = momentumData.length > 0 ? momentumData : [{ name: 'Start', count: 0 }];

  // 3. Topic Expertise (Radar Chart based on tags)
  const tagExpertise: Record<string, number> = {};
  submissions.filter(s => s.status === 'accepted').forEach(s => {
    const assignment = assignments.find(a => a._id === s.assignmentId);
    assignment?.tags?.forEach(tag => {
      tagExpertise[tag] = (tagExpertise[tag] || 0) + 1;
    });
  });

  const radarData = Object.entries(tagExpertise).map(([subject, fullMark]) => ({
    subject,
    A: fullMark,
    fullMark: assignments.length,
  })).slice(0, 6); // Limit to top 6 for UI clarity

  // 4. Difficulty Breakdown (Bar Chart)
  const difficultyMap = {
    beginner: { count: 0, accepted: 0 },
    intermediate: { count: 0, accepted: 0 },
    advanced: { count: 0, accepted: 0 },
  };

  assignments.forEach(a => {
    if (difficultyMap[a.difficulty]) {
        difficultyMap[a.difficulty].count++;
        const sub = submissions.find(s => s.assignmentId === a._id);
        if (sub?.status === 'accepted') {
            difficultyMap[a.difficulty].accepted++;
        }
    }
  });

  const barData = Object.entries(difficultyMap).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    Total: data.count,
    Completed: data.accepted,
  }));

  const chartTheme = {
    backgroundColor: "rgba(21, 16, 37, 0.95)",
    borderColor: "rgba(51, 39, 89, 0.6)",
    color: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    padding: "12px",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Completion Donut */}
      <div className="group relative overflow-hidden bg-[#151025]/60 backdrop-blur-xl rounded-3xl border border-slate-800/60 p-8 transition-all hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/5">
        <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-violet-600/5 blur-3xl group-hover:bg-violet-600/10 transition-colors" />
        <h3 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-[0.2em]">Completion Status</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={chartTheme}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-xs font-medium text-slate-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Momentum Area Chart */}
      <div className="group relative overflow-hidden bg-[#151025]/60 backdrop-blur-xl rounded-3xl border border-slate-800/60 p-8 transition-all hover:border-fuchsia-500/30 hover:shadow-2xl hover:shadow-fuchsia-500/5">
        <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-fuchsia-600/5 blur-3xl group-hover:bg-fuchsia-600/10 transition-colors" />
        <h3 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-[0.2em]">Learning Momentum</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayMomentum}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c026d3" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c026d3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#332759" vertical={false} opacity={0.4} />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={chartTheme}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#d946ef" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                strokeWidth={4}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Expertise Radar */}
      <div className="group relative overflow-hidden bg-[#151025]/60 backdrop-blur-xl rounded-3xl border border-slate-800/60 p-8 transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5">
        <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-emerald-600/5 blur-3xl group-hover:bg-emerald-600/10 transition-colors" />
        <h3 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-[0.2em]">Competency Matrix</h3>
        <div className="h-[300px]">
            {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#332759" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} />
                        <Radar
                            name="Skill Level"
                            dataKey="A"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                            animationDuration={1500}
                        />
                        <Tooltip contentStyle={chartTheme} />
                    </RadarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex flex-col h-full items-center justify-center text-slate-500 text-sm gap-2">
                    <div className="h-1 bg-slate-800 w-32 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/20 w-1/3" />
                    </div>
                    Accept assignments to map your skills
                </div>
            )}
        </div>
      </div>

      {/* Difficulty Breakdown Bar */}
      <div className="group relative overflow-hidden bg-[#151025]/60 backdrop-blur-xl rounded-3xl border border-slate-800/60 p-8 transition-all hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5">
        <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-colors" />
        <h3 className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-[0.2em]">Difficulty Progression</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#332759" vertical={false} opacity={0.4} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTheme} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Legend verticalAlign="bottom" align="center" height={36} formatter={(value) => <span className="text-xs font-medium text-slate-300">{value}</span>} />
              <Bar dataKey="Total" fill="#332759" radius={[6, 6, 0, 0]} barSize={24} />
              <Bar dataKey="Completed" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
