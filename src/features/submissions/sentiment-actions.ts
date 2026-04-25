"use server";

import Sentiment from "sentiment";

export async function analyzeStudentMorale(notes: string[]) {
  if (!notes || notes.length === 0) return { score: 0, label: "Insufficient Data" };

  const analyzer = new Sentiment();
  let totalScore = 0;
  let validNotesCount = 0;

  notes.forEach(note => {
    if (note && typeof note === "string" && note.trim().length > 0) {
      const result = analyzer.analyze(note);
      totalScore += result.score;
      validNotesCount++;
    }
  });

  if (validNotesCount === 0) return { score: 0, label: "No Submissions Have Notes" };

  const averageScore = totalScore / validNotesCount;

  let label = "Neutral";
  if (averageScore > 2) label = "Highly Positive 🤩";
  else if (averageScore > 0.5) label = "Generally Positive 🙂";
  else if (averageScore < -2) label = "Highly Frustrated 😩";
  else if (averageScore < -0.5) label = "Slightly Struggling 😟";

  return { averageScore: Number(averageScore.toFixed(2)), label };
}
