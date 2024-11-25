import React, { useState, useEffect } from 'react';
import { Users, Star, Coins, ArrowRightLeft } from 'lucide-react';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import CustomerEngagementChart from '../components/CustomerEngagementChart';
import ReviewSentimentChart from '../components/ReviewSentimentChart';
import { gmbService } from '../services/gmb';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalReviews: 0,
    averageRating: 0,
    reviewChange: '0%',
    ratingChange: '0',
  });

  useEffect(() => {
    let mounted = true;

    const fetchMetrics = async () => {
      try {
        const latest = await gmbService.fetchMetrics();
        const changes = gmbService.calculateChange();
        
        if (mounted) {
          setMetrics({
            totalReviews: latest.totalReviews,
            averageRating: latest.averageRating,
            reviewChange: changes.reviewChange,
            ratingChange: changes.ratingChange,
          });
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 24 * 60 * 60 * 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Sarah</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your business today</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Reviews"
          value={metrics.totalReviews.toString()}
          change={metrics.reviewChange}
          isPositive={parseFloat(metrics.reviewChange) >= 0}
          icon={Users}
        />
        <StatCard
          title="Review Score"
          value={metrics.averageRating.toFixed(1)}
          change={metrics.ratingChange}
          isPositive={parseFloat(metrics.ratingChange) >= 0}
          icon={Star}
        />
        <StatCard
          title="Coming Soon"
          value="0"
          change="0"
          isPositive={true}
          icon={Coins}
        />
        <StatCard
          title="Revenue"
          value="N/A"
          change="0.0%"
          isPositive={true}
          icon={ArrowRightLeft}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Customer Engagement">
          <CustomerEngagementChart />
        </Chart>
        <Chart title="Review Sentiment">
          <ReviewSentimentChart />
        </Chart>
      </div>
    </>
  );
}