import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

const customers = [
  { id: 1, name: 'Emma Wilson', email: 'emma@example.com', status: 'Active', points: 2430, joined: '2024-01-15' },
  { id: 2, name: 'James Chen', email: 'james@example.com', status: 'Inactive', points: 1250, joined: '2023-11-20' },
  { id: 3, name: 'Sofia Garcia', email: 'sofia@example.com', status: 'Active', points: 3670, joined: '2023-12-05' },
];

export default function Customers() {
  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage and analyze your customer base</p>
        </div>
        <button className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90">
          Add Customer
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#336633]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Points</th>
                <th className="text-left py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{customer.name}</td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{customer.points}</td>
                  <td className="py-3 px-4">{customer.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}