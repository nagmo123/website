import React from 'react';
import { motion } from 'framer-motion';

const mockInsights = {
  mostVisited: [
    { name: 'Botanical Bliss', visits: 1200 },
    { name: 'Bahama Breeze', visits: 950 },
    { name: 'Midnight Garden', visits: 870 },
  ],
  mostClicked: [
    { name: 'Minimalist Zen', clicks: 540 },
    { name: 'Vrindavan', clicks: 480 },
    { name: 'Paris Pet Party', clicks: 410 },
  ],
  recommendations: [
    { name: 'Oceanic Calm', reason: 'Trending in June' },
    { name: 'Golden Hour', reason: 'High conversion rate' },
  ],
};

const ProductInsights: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-2xl font-bold text-primary-700 mb-6">Product Insights</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Visited</h2>
        <ul>
          {mockInsights.mostVisited.map((item) => (
            <li key={item.name} className="flex justify-between py-2 border-b border-gray-100">
              <span>{item.name}</span>
              <span className="font-bold text-primary-700">{item.visits}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Clicked</h2>
        <ul>
          {mockInsights.mostClicked.map((item) => (
            <li key={item.name} className="flex justify-between py-2 border-b border-gray-100">
              <span>{item.name}</span>
              <span className="font-bold text-primary-700">{item.clicks}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
      <ul>
        {mockInsights.recommendations.map((rec) => (
          <li key={rec.name} className="flex justify-between py-2 border-b border-gray-100">
            <span>{rec.name}</span>
            <span className="text-sm text-gray-500">{rec.reason}</span>
          </li>
        ))}
      </ul>
    </div>
    {/* Placeholder for charts/graphs */}
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-primary-50 rounded-xl p-8 flex flex-col items-center justify-center">
      <span className="text-primary-700 font-semibold mb-2">[Charts/Graphs Placeholder]</span>
      <div className="w-32 h-32 bg-primary-200 rounded-full animate-pulse" />
    </motion.div>
  </motion.div>
);

export default ProductInsights; 