import { Request, Response } from 'express';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';

interface AuthRequest extends Request {
  user: { id: string; role: string };
}

// Get user's wishlist with product details
export const getUserWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user.id })
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(wishlistItems);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    console.log('addToWishlist called. req.body:', req.body, 'req.user:', req.user);
    const { productId } = req.body;
    
    if (!productId) {
      console.error('No productId in request body');
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.error('Product not found for productId:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ 
      userId: req.user.id, 
      productId 
    });

    if (existingItem) {
      console.warn('Product already in wishlist for user:', req.user.id, 'productId:', productId);
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId
    });

    const populatedItem = await Wishlist.findById(wishlistItem._id)
      .populate('productId');

    res.status(201).json(populatedItem);
  } catch (err: any) {
    console.error('Error in addToWishlist:', err && err.stack ? err.stack : err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    
    const deletedItem = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      productId
    });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Check if product is in user's wishlist
export const checkWishlistStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      productId
    });

    res.json({ isInWishlist: !!wishlistItem });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req: AuthRequest, res: Response) => {
  try {
    await Wishlist.deleteMany({ userId: req.user.id });
    
    res.json({ message: 'Wishlist cleared' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 