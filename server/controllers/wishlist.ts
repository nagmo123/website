import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';

interface AuthRequest extends Request {
  user: { id: string };
}

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    res.json(wishlist.products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    if (!wishlist.products.includes(productId)) wishlist.products.push(productId);
    await wishlist.save();
    res.json(wishlist.products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.products = wishlist.products.filter(
      (id: any) => id.toString() !== req.params.productId
    );
    await wishlist.save();
    res.json(wishlist.products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 