import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export default function StatCard({ title, value, change, isPositive, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`w-5 h-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last month</span>
      </div>
    </div>
  );
}