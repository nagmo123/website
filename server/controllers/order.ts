import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import { Parser } from 'json2csv';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    let filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) filter.user = req.query.customer;
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate as string), $lte: new Date(req.query.endDate as string) };
    }
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find(filter).populate('user items.product');
    } else {
      orders = await Order.find({ ...filter, user: req.user.id }).populate('items.product');
    }
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingInfo, cardInfo } = req.body;
    if (!shippingInfo || !cardInfo) {
      return res.status(400).json({ message: 'Shipping and card info are required' });
    }
    if (!cardInfo.brand || !cardInfo.last4) {
      return res.status(400).json({ message: 'Only card brand and last4 are allowed' });
    }
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const total = cart.items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedMaterial: item.selectedMaterial,
      })),
      total,
      status: 'pending',
      shippingInfo,
      cardInfo: { brand: cardInfo.brand, last4: cardInfo.last4 },
    });
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const payOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    order.status = 'paid';
    await order.save();
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const exportOrders = async (req: AuthRequest, res: Response) => {
  try {
    let filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) filter.user = req.query.customer;
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = { $gte: new Date(req.query.startDate as string), $lte: new Date(req.query.endDate as string) };
    }
    const orders = await Order.find(filter).populate('user items.product');
    const fields = ['_id', 'user.name', 'total', 'status', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(orders);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 