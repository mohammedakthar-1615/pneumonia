import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GraphView = ({ data }) => {
  const chartData = data.map((record, index) => ({
    date: new Date(record.createdAt).toLocaleDateString(),
    accuracy: record.accuracy,
    precision: record.precision,
    f1Score: record.f1Score
  }));

  return (
    <div>
      <h3>Progression Graph</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
          <Line type="monotone" dataKey="precision" stroke="#82ca9d" />
          <Line type="monotone" dataKey="f1Score" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphView;