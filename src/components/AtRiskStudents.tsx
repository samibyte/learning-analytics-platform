"use client";

import { StudentRiskProfile } from "@/features/analytics/services/riskDetection";
import { AlertCircle, AlertTriangle, AlertOctagon, Mail } from "lucide-react";
import Link from "next/link";

export function AtRiskStudents({
  profiles,
}: {
  profiles: StudentRiskProfile[];
}) {
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-t border-slate-800/60 bg-[#151025]">
        <CheckCircleBadge />
        <p className="mt-4 text-sm font-medium text-slate-300">
          No At-Risk Students
        </p>
        <p className="text-xs text-slate-500 mt-1 text-center">
          Great job! Everyone seems to be keeping up.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-[#1A1429] text-xs uppercase text-slate-500">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">
              Student
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Risk Level
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Needs Improvement
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Late / Missing
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {profiles.map((profile) => (
            <tr
              key={profile.studentId}
              className="bg-[#151025] hover:bg-[#1A1429] transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-white">
                    {profile.studentName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {profile.studentEmail}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <SeverityBadge severity={profile.severity} />
              </td>
              <td className="px-6 py-4 font-medium text-amber-500/90">
                {profile.needsImprovementCount}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 text-xs">
                  <span className={profile.lateSubmissionsCount > 0 ? "text-orange-400" : "text-slate-500"}>
                    {profile.lateSubmissionsCount} Late
                  </span>
                  <span className={profile.missingSubmissionsCount > 0 ? "text-red-400" : "text-slate-500"}>
                    {profile.missingSubmissionsCount} Missing
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <a
                  href={`mailto:${profile.studentEmail}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-white transition-colors border border-slate-700/50"
                  title="Contact Student"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Reach Out</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  switch (severity) {
    case "high":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-500 border border-red-500/20">
          <AlertOctagon className="h-3.5 w-3.5" />
          High Risk
        </span>
      );
    case "medium":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 border border-orange-500/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          Moderate
        </span>
      );
    case "low":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
          <AlertCircle className="h-3.5 w-3.5" />
          Low
        </span>
      );
  }
}

function CheckCircleBadge() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
      <svg
        className="h-6 w-6 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}
