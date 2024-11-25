import React from 'react';
import { Gift, Award, Trophy } from 'lucide-react';

const tiers = [
  {
    name: 'Bronze',
    icon: Gift,
    points: '0-1000',
    benefits: ['5% discount on purchases', 'Birthday reward', 'Newsletter access'],
  },
  {
    name: 'Silver',
    icon: Award,
    points: '1001-5000',
    benefits: ['10% discount on purchases', 'Priority support', 'Exclusive events access'],
  },
  {
    name: 'Gold',
    icon: Trophy,
    points: '5001+',
    benefits: ['15% discount on purchases', 'VIP support', 'Free shipping', 'Early access to sales'],
  },
];

export default function Loyalty() {
  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loyalty Program</h1>
          <p className="text-gray-600 mt-1">Manage your loyalty tiers and rewards</p>
        </div>
        <button className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90">
          Create Reward
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tiers.map((tier) => (
          <div key={tier.name} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#336633]/10">
                <tier.icon className="w-6 h-6 text-[#336633]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                <p className="text-sm text-gray-500">{tier.points} points</p>
              </div>
            </div>
            <ul className="space-y-2">
              {tier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#336633]" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Redemptions</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Customer</th>
              <th className="text-left py-3 px-4">Reward</th>
              <th className="text-left py-3 px-4">Points Used</th>
              <th className="text-left py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4">Emma Wilson</td>
              <td className="py-3 px-4">$50 Store Credit</td>
              <td className="py-3 px-4">500</td>
              <td className="py-3 px-4">2024-03-01</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 px-4">James Chen</td>
              <td className="py-3 px-4">Free Shipping</td>
              <td className="py-3 px-4">200</td>
              <td className="py-3 px-4">2024-02-28</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}