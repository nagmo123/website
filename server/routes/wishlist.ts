import express, { Request, Response, NextFunction } from 'express';
import { getUserWishlist, addToWishlist, removeFromWishlist, checkWishlistStatus, clearWishlist } from '../controllers/wishlist';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware);

// Get user's wishlist
router.get('/', getUserWishlist as unknown as (req: Request, res: Response, next: NextFunction) => void);

// Add product to wishlist
router.post('/add', addToWishlist as unknown as (req: Request, res: Response, next: NextFunction) => void);

// Remove product from wishlist
router.delete('/remove/:productId', removeFromWishlist as unknown as (req: Request, res: Response, next: NextFunction) => void);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlistStatus as unknown as (req: Request, res: Response, next: NextFunction) => void);

// Clear entire wishlist
router.delete('/clear', clearWishlist as unknown as (req: Request, res: Response, next: NextFunction) => void);

export default router; 