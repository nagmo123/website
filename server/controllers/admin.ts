import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export const getRevenue = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ status: { $in: ['paid', 'shipped', 'delivered'] } });
    const revenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
    res.json({ revenue });
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

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email');
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 