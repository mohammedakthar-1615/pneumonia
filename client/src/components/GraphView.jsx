import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';

const GraphView = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        <p>No data available for visualization</p>
      </div>
    );
  }

  const chartData = data.map((record, index) => {
    // Parse values, handle both decimal (0-1) and percentage (0-100) formats
    const parseValue = (val) => {
      if (val === null || val === undefined) return 0;
      const num = parseFloat(val);
      return isNaN(num) ? 0 : (num > 1 ? num : num * 100);
    };

    return {
      date: new Date(record.createdAt).toLocaleDateString(),
      prediction: record.prediction || 'N/A',
      accuracy: parseValue(record.accuracy),
      precision: parseValue(record.precision),
      f1Score: parseValue(record.f1Score),
      confidence: parseValue(record.confidence),
      index: index + 1
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '12px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 'bold' }}>
            {payload[0]?.payload?.date}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color, fontSize: '13px' }}>
              {entry.name}: <strong>{entry.value?.toFixed(2)}%</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Check if this is a single record or multiple records
  const isSingleRecord = chartData.length === 1;

  return (
    <div style={{ width: '100%' }}>
      {/* Metrics Comparison Chart */}
      <ResponsiveContainer width="100%" height={isSingleRecord ? 350 : 400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            stroke="#666"
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Accuracy"
          />
          <Line 
            type="monotone" 
            dataKey="precision" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 5 }}
            activeDot={{ r: 7 }}
            name="Precision"
          />
          <Line 
            type="monotone" 
            dataKey="f1Score" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 5 }}
            activeDot={{ r: 7 }}
            name="F1 Score"
          />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 5 }}
            activeDot={{ r: 7 }}
            name="Confidence"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Summary Table - Always show for clarity */}
      <div style={{ marginTop: '24px', overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #dee2e6' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid #dee2e6' }}>Prediction</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid #dee2e6' }}>Accuracy</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid #dee2e6' }}>Precision</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid #dee2e6' }}>F1 Score</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, borderBottom: '2px solid #dee2e6' }}>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, idx) => (
              <tr key={idx} style={{ 
                backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa',
                borderBottom: '1px solid #dee2e6'
              }}>
                <td style={{ padding: '12px', textAlign: 'left' }}>{row.date}</td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: 500 }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: row.prediction === 'Pneumonia' ? '#fee2e2' : '#dcfce7',
                    color: row.prediction === 'Pneumonia' ? '#dc2626' : '#16a34a'
                  }}>
                    {row.prediction}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 500, color: '#3b82f6' }}>{row.accuracy?.toFixed(2)}%</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 500, color: '#10b981' }}>{row.precision?.toFixed(2)}%</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 500, color: '#f59e0b' }}>{row.f1Score?.toFixed(2)}%</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 500, color: '#ef4444' }}>{row.confidence?.toFixed(2)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show metric differences for debugging/clarity */}
      {chartData.length === 1 && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
          <p style={{ marginTop: 0, fontSize: '12px', color: '#666' }}>
            <strong>Metric Breakdown (Single Prediction):</strong><br/>
            • <span style={{ color: '#3b82f6' }}>Accuracy</span>: {chartData[0].accuracy.toFixed(2)}% - Overall correctness of the model<br/>
            • <span style={{ color: '#10b981' }}>Precision</span>: {chartData[0].precision.toFixed(2)}% - Reliability of positive predictions<br/>
            • <span style={{ color: '#f59e0b' }}>F1 Score</span>: {chartData[0].f1Score.toFixed(2)}% - Balanced measure of precision and recall<br/>
            • <span style={{ color: '#ef4444' }}>Confidence</span>: {chartData[0].confidence.toFixed(2)}% - AI's certainty in this prediction
          </p>
        </div>
      )}
    </div>
  );
};

export default GraphView;