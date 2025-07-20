import React from 'react';
import { motion } from 'framer-motion';

const mockAbandonedCarts = [
  { id: 'U001', name: 'John Doe', email: 'john@example.com', items: 3, lastActive: '2024-06-01 14:23', cartValue: '$120.00' },
  { id: 'U002', name: 'Jane Smith', email: 'jane@example.com', items: 2, lastActive: '2024-06-01 13:10', cartValue: '$85.00' },
  { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', items: 5, lastActive: '2024-05-31 19:45', cartValue: '$210.00' },
];

const AbandonedCarts: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-2xl font-bold text-primary-700 mb-6">Abandoned Cart Tracking</h1>
    <div className="bg-white rounded-xl shadow-lg p-6">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">User ID</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Cart Value</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {mockAbandonedCarts.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-primary-50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-900">{user.id}</td>
              <td className="py-3 px-4 text-gray-900">{user.name}</td>
              <td className="py-3 px-4 text-gray-600">{user.email}</td>
              <td className="py-3 px-4 text-gray-600">{user.items}</td>
              <td className="py-3 px-4 font-medium text-primary-700">{user.cartValue}</td>
              <td className="py-3 px-4 text-gray-600">{user.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default AbandonedCarts; 