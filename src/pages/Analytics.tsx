import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import Chart from '../components/Chart';

type TimePeriod = '7days' | 'mtd' | '30days';

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');
  const [showDropdown, setShowDropdown] = useState(false);

  const periods = {
    '7days': 'Last 7 Days',
    'mtd': 'Month to Date',
    '30days': 'Last 30 Days',
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Calendar className="w-5 h-5" />
              {periods[timePeriod]}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                {Object.entries(periods).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTimePeriod(key as TimePeriod);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                      timePeriod === key ? 'text-[#336633] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90">
            Download Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart title="Revenue Over Time">
          <div className="h-64 flex items-center justify-center text-gray-400">
            Revenue chart visualization
          </div>
        </Chart>
        <Chart title="Customer Growth">
          <div className="h-64 flex items-center justify-center text-gray-400">
            Customer growth chart
          </div>
        </Chart>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Popular Products">
          <div className="h-64 flex items-center justify-center text-gray-400">
            Products chart
          </div>
        </Chart>
        <Chart title="Customer Segments">
          <div className="h-64 flex items-center justify-center text-gray-400">
            Segments chart
          </div>
        </Chart>
      </div>
    </div>
  );
}