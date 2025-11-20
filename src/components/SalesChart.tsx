import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface SalesChartProps {
  data: number[];
  labels?: string[];
  height?: number;
}

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  height = 300,
}) => {
  // Transform data for Recharts with multiple series
  const chartData = data.map((value, index) => ({
    name: labels[index] || `Day ${index + 1}`,
    sales: value,
    // Calculate target (10% above sales for example)
    target: Math.round(value * 1.1),
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#1A1F36] mb-4">Simple Line Chart</h3>
      <LineChart
        style={{ width: '100%', height: `${height}px` }}
        responsive
        data={chartData}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#82ca9d"
        />
      </LineChart>
    </div>
  );
};

export default SalesChart;

