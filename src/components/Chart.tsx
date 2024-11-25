import React from 'react';

interface ChartProps {
  title: string;
  children: React.ReactNode;
}

export default function Chart({ title, children }: ChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}