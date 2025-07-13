import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

interface AuthRequest extends Request {
  user: { id: string };
}

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1, selectedColor, selectedMaterial } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    const existing = cart.items.find((item: any) => item.product.equals(productId) && item.selectedColor === selectedColor && item.selectedMaterial === selectedMaterial);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, selectedColor, selectedMaterial });
    }
    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find((item: any) => item._id?.toString() === req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (quantity <= 0) {
      cart.items = cart.items.filter((item: any) => item._id?.toString() !== req.params.itemId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((item: any) => item._id?.toString() !== req.params.itemId);
    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 