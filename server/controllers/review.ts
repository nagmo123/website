import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import ReviewModel from '../models/Review';

interface ReviewRequestBody {
  rating: number;
  comment?: string;
}

interface AuthRequest extends Request {
  user: {
    id: string;
    role?: string;
  };
}

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body as ReviewRequestBody;
    const product = req.params.id;
    const user = req.user.id;
    // Prevent duplicate reviews by same user for same product
    const existing = await ReviewModel.findOne({ user, product });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });
    const review = await ReviewModel.create({ user, product, rating, comment });
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const product = req.params.id;
    const reviews = await ReviewModel.find({ product }).populate('user', 'name');
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const review = await ReviewModel.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 