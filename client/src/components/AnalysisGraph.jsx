import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AnalysisGraph = ({ confidence, accuracyRange, riskLevel }) => {


  const parseAccuracy = () => {
    if (!accuracyRange) return 0;
    const nums = accuracyRange.replace("%", "").split("–");
    return (parseInt(nums[0]) + parseInt(nums[1])) / 2;
  };

  const riskEfficiency =
    riskLevel === "High Risk"
      ? 85
      : riskLevel === "Moderate Risk"
      ? 65
      : 45;

  const data = [
    {
      stage: "Initial Scan",
      Confidence: confidence - 10,
      Accuracy: parseAccuracy() - 8,
      Risk: riskEfficiency - 5,
    },
    {
      stage: "Feature Extraction",
      Confidence: confidence - 5,
      Accuracy: parseAccuracy() - 3,
      Risk: riskEfficiency - 2,
    },
    {
      stage: "Model Evaluation",
      Confidence: confidence,
      Accuracy: parseAccuracy(),
      Risk: riskEfficiency,
    },
    {
      stage: "Final Analysis",
      Confidence: confidence - 3,
      Accuracy: parseAccuracy() - 4,
      Risk: riskEfficiency - 6,
    },
  ];

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="stage" stroke="#94a3b8" />
          <YAxis domain={[0, 100]} stroke="#94a3b8" />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="Confidence"
            stroke="#3b82f6"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="Accuracy"
            stroke="#22c55e"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="Risk"
            stroke="#ef4444"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisGraph;
