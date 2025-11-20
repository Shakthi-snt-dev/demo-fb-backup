import React from 'react';

interface SimpleChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  labels,
  height = 200,
  color = '#007BFF',
}) => {
  const maxValue = Math.max(...data, 1);
  const chartHeight = height - 40;
  const barWidth = 100 / data.length;

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border-t border-[#E0E7F1]"
            style={{ opacity: i === 0 ? 0 : 0.3 }}
          />
        ))}
      </div>

      {/* Bars */}
      <div className="absolute inset-0 flex items-end justify-between px-2 pb-8">
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 mx-0.5"
            >
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  minHeight: value > 0 ? '4px' : '0',
                }}
              />
              {labels && labels[index] && (
                <span className="text-xs text-[#4A5568] mt-2 text-center">
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex flex-col justify-between h-full pb-8">
        {[4, 3, 2, 1, 0].map((i) => (
          <span
            key={i}
            className="text-xs text-[#4A5568] -ml-12"
            style={{ marginTop: i === 0 ? '0' : '-8px' }}
          >
            {Math.round((maxValue / 4) * i)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SimpleChart;

