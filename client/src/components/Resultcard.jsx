import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ResultCard = ({ result }) => {
  const navigate = useNavigate();

  if (!result) return null;

  const isPneumonia = result.prediction.includes("PNEUMONIA");

  // Custom tooltips for BarChart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg text-white text-sm">
          <p className="font-semibold">{label}</p>
          <p>{`Probability: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* 1. TOP BANNER */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">

        <div className="flex-1">
          <p className="text-xs text-gray-400 font-semibold tracking-wider mb-1 uppercase">
            Diagnostic Result
          </p>
          <p className={`text-2xl md:text-3xl font-bold uppercase tracking-wide ${isPneumonia ? "text-red-400" : "text-emerald-400"}`}>
            {result.prediction}
          </p>
        </div>

        <div className="flex-1">
          <p className="text-xs text-gray-400 font-semibold tracking-wider mb-1 uppercase">
            System Confidence
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            {result.confidence}%
          </p>
        </div>

        <div className="flex-1">
          <p className="text-xs text-gray-400 font-semibold tracking-wider mb-1 uppercase">
            Infection Prob.
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            {result.infectionProb}%
          </p>
        </div>

        <div className="flex-1">
          <p className="text-xs text-gray-400 font-semibold tracking-wider mb-1 uppercase">
            Clinical Severity
          </p>
          <p className={`text-2xl md:text-3xl font-bold tracking-wide ${isPneumonia ? "text-red-400" : "text-emerald-400"}`}>
            {result.severity || "N/A"}
          </p>
        </div>
      </div>

      {/* 2. IMAGES ROW (5 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {result.images?.map((img, index) => (
          <div key={index} className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow flex flex-col items-center">
            <h3 className="text-[10px] sm:text-xs text-blue-400 font-bold mb-2 uppercase tracking-tight text-center">
              {img.title}
            </h3>
            <div className="w-full aspect-square bg-slate-900 rounded-lg overflow-hidden border border-slate-700/50">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Left: Patient Probability (Bar Chart) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-lg">📊</span>
            <h2 className="text-lg font-bold text-slate-200">Patient Probability</h2>
          </div>
          <h3 className="text-center text-sm text-slate-300 mb-6 font-medium">Patient Diagnostic Probability</h3>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.probabilities}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barSize={120}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dx={-10} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {result.probabilities?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Normal' ? '#2dd4bf' : '#fb7185'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Labels on top of bars roughly matching design */}
          <div className="flex justify-around px-10 -mt-[280px] mb-[260px] pointer-events-none relative z-10">
            <span className="text-emerald-400 font-bold text-sm bg-slate-900/80 px-2 py-0.5 rounded">{result.probabilities[0]?.value}%</span>
            <span className="text-rose-400 font-bold text-sm bg-slate-900/80 px-2 py-0.5 rounded">{result.probabilities[1]?.value}%</span>
          </div>
        </div>

        {/* Right: Performance Matrix */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">📈</span>
            <h2 className="text-lg font-bold text-slate-200">Performance Matrix</h2>
          </div>
          <div className="text-center mb-6">
            <h3 className="text-sm text-slate-300 font-medium">System Overall Performance</h3>
            <p className="text-xs text-slate-400">(Dataset: 1,341 Normal | 3,875 Pneumonia)</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-[auto_1fr] gap-2 w-full max-w-md">

              {/* Y-axis label */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-slate-400 -rotate-90 whitespace-nowrap origin-center translate-x-3">True Category</span>
              </div>

              <div className="flex flex-col gap-1 w-full relative">
                <div className="grid grid-cols-[auto_1fr_1fr] gap-1 flex-1">
                  {/* Sub Y-axis labels */}
                  <div className="flex flex-col justify-around text-[10px] text-slate-400 w-8 text-right pr-2">
                    <span>Normal</span>
                    <span>Pneumonia</span>
                  </div>

                  {/* Top Left: True Normal, Pred Normal */}
                  <div className="bg-blue-300/40 rounded flex items-center justify-center h-28 aspect-square min-w-0">
                    <span className="text-slate-300 text-sm font-medium">{result.matrix?.trueNormal_predNormal}</span>
                  </div>

                  {/* Top Right: True Normal, Pred Pneumonia */}
                  <div className="bg-slate-700/50 rounded flex items-center justify-center h-28 aspect-square min-w-0">
                    <span className="text-slate-300 text-sm font-medium">{result.matrix?.trueNormal_predPneumonia}</span>
                  </div>

                  {/* Bottom Left: True Pneumonia, Pred Normal */}
                  <div className="bg-slate-700/50 rounded flex justify-center items-center h-28 aspect-square min-w-0 relative">
                    {/* Little red dot from mockup */}
                    <div className="absolute left-2 top-1/2 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <span className="text-slate-300 text-sm font-medium">{result.matrix?.truePneumonia_predNormal}</span>
                  </div>

                  {/* Bottom Right: True Pneumonia, Pred Pneumonia */}
                  <div className="bg-blue-600/60 rounded flex items-center justify-center h-28 aspect-square min-w-0">
                    <span className="text-slate-100 text-sm font-medium">{result.matrix?.truePneumonia_predPneumonia}</span>
                  </div>
                </div>

                {/* X-axis sub labels */}
                <div className="grid grid-cols-[auto_1fr_1fr] pl-8">
                  <div></div>
                  <div className="text-center text-[10px] text-slate-400 mt-1">Normal</div>
                  <div className="text-center text-[10px] text-slate-400 mt-1">Pneumonia</div>
                </div>

                {/* Main X-axis label */}
                <div className="text-center text-xs text-slate-400 mt-2 ml-8">
                  Predicted Category
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. ACTION BUTTON */}
      <div className="flex justify-center mt-12 pt-4">
        <button
          onClick={() => navigate('/upload')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 uppercase tracking-wide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Run New Analysis
        </button>
      </div>

    </div>
  );
};

export default ResultCard;

