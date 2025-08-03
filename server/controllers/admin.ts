import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Wishlist from '../models/Wishlist';

// Dashboard Statistics
export const getRevenue = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ status: { $in: ['paid', 'shipped', 'delivered'] } });
    const revenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
    res.json({ revenue: revenue.toFixed(2) });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderCount = async (req: Request, res: Response) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductCount = async (req: Request, res: Response) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCustomerCount = async (req: Request, res: Response) => {
  try {
    const count = await User.countDocuments({ role: 'customer' });
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard Overview
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [revenue, orderCount, productCount, customerCount] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' })
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

    res.json({
      revenue: totalRevenue.toFixed(2),
      orderCount,
      productCount,
      customerCount
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Recent Orders
export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email');
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// All Orders with pagination
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const search = req.query.search as string;

    let query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get Order Details
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// All Products with pagination
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;

    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get Product Categories
export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// All Customers with pagination
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    let query: any = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get Customer Details with Orders
export const getCustomerDetails = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    
    const customer = await User.findById(customerId).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      customer,
      orders,
      totalSpent: totalSpent.toFixed(2),
      orderCount: orders.length
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Analytics Data
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [revenueData, orderData, customerData] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $in: ['paid', 'shipped', 'delivered'] } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' } } },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: startDate }, role: 'customer' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, customers: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      revenue: revenueData,
      orders: orderData,
      customers: customerData
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Abandoned Carts
export const getAbandonedCarts = async (req: Request, res: Response) => {
  try {
    const abandonedCarts = await Order.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(abandonedCarts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Product Insights
export const getProductInsights = async (req: Request, res: Response) => {
  try {
    const productInsights = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { name: '$product.name', totalSold: 1, revenue: 1 } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json(productInsights);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 