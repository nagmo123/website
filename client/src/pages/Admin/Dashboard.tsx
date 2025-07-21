import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { API_BASE_URL } from '../../api/config';
import { Product } from '../../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`).then(r => r.json()).then(data => setProducts(data));
  }, []);

  // Mock data for dashboard
  const stats = [
    { label: 'Total Revenue', value: '$124,563', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Total Orders', value: '1,247', change: '+8.2%', icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Total Products', value: '156', change: '+3.1%', icon: Package, color: 'text-purple-600' },
    { label: 'Active Customers', value: '2,847', change: '+15.3%', icon: Users, color: 'text-orange-600' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'Botanical Bliss', amount: '$89.00', status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'Bahama Breeze', amount: '$95.00', status: 'processing', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'Mike Johnson', product: 'Midnight Garden', amount: '$115.00', status: 'shipped', date: '2024-01-13' },
    { id: 'ORD-004', customer: 'Sarah Wilson', product: 'Minimalist Zen', amount: '$59.00', status: 'pending', date: '2024-01-12' },
    { id: 'ORD-005', customer: 'David Brown', product: 'Vrindavan', amount: '$79.00', status: 'completed', date: '2024-01-11' },
  ];

  const allOrders = [
    ...recentOrders,
    { id: 'ORD-006', customer: 'Emily Davis', product: 'Paris Pet Party', amount: '$69.00', status: 'cancelled', date: '2024-01-10' },
    { id: 'ORD-007', customer: 'Chris Lee', product: 'Botanical Bliss', amount: '$89.00', status: 'completed', date: '2024-01-09' },
    { id: 'ORD-008', customer: 'Lisa Garcia', product: 'Bahama Breeze', amount: '$95.00', status: 'shipped', date: '2024-01-08' },
  ];

  const customers = [
    { id: 'CUST-001', name: 'John Doe', email: 'john@example.com', orders: 5, spent: '$445.00', joined: '2023-12-01' },
    { id: 'CUST-002', name: 'Jane Smith', email: 'jane@example.com', orders: 3, spent: '$285.00', joined: '2023-11-15' },
    { id: 'CUST-003', name: 'Mike Johnson', email: 'mike@example.com', orders: 7, spent: '$805.00', joined: '2023-10-20' },
    { id: 'CUST-004', name: 'Sarah Wilson', email: 'sarah@example.com', orders: 2, spent: '$138.00', joined: '2024-01-05' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Nagomi</title>
        <meta name="description" content="Manage your wallpaper store with our comprehensive admin dashboard." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your wallpaper store efficiently</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-50`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <Link
                    to="#"
                    onClick={() => setActiveTab('orders')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                          <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-600">{order.product}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Products Header */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
                    <p className="text-gray-600">Manage your wallpaper collection</p>
                  </div>
                  <Link
                    to="/admin/products/add"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </Link>
                </div>
                
                {/* Search */}
                <div className="mt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{product.name}</h3>
                        <span className="text-lg font-bold text-primary-600">${product.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.bestseller && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id || product.id}`}
                          className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors text-center text-sm flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Link>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/products/${product.id}`}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Orders Management</h2>
                    <p className="text-gray-600">Track and manage customer orders</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                          <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-600">{order.product}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{order.amount}</td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Customer Management</h2>
                    <p className="text-gray-600">View and manage customer accounts</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Customer ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Orders</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Total Spent</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{customer.id}</td>
                          <td className="py-3 px-4 text-gray-900">{customer.name}</td>
                          <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                          <td className="py-3 px-4 text-gray-600">{customer.orders}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{customer.spent}</td>
                          <td className="py-3 px-4 text-gray-600">{customer.joined}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;