import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsDashboard: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-2xl font-bold text-primary-700 mb-6">Analytics Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <span className="text-lg font-semibold text-gray-900 mb-2">Google Analytics</span>
        <span className="text-primary-700 mb-4">Tracking Active</span>
        <div className="w-32 h-32 bg-primary-200 rounded-full animate-pulse mb-4" />
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">Settings</button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <span className="text-lg font-semibold text-gray-900 mb-2">Microsoft Clarity</span>
        <span className="text-primary-700 mb-4">Tracking Inactive</span>
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-4" />
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">Connect</button>
      </div>
    </div>
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-primary-50 rounded-xl p-8 flex flex-col items-center justify-center">
      <span className="text-primary-700 font-semibold mb-2">[Analytics Charts Placeholder]</span>
      <div className="w-32 h-32 bg-primary-200 rounded-full animate-pulse" />
    </motion.div>
  </motion.div>
);

export default AnalyticsDashboard; 