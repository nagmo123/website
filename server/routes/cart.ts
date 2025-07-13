"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import { Router, Request, Response, NextFunction } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, (req: Request, res: Response, next: NextFunction) => getCart(req as any, res));
router.post('/', authMiddleware, (req: Request, res: Response, next: NextFunction) => addToCart(req as any, res));
router.put('/:itemId', authMiddleware, (req: Request, res: Response, next: NextFunction) => updateCartItem(req as any, res));
router.delete('/:itemId', authMiddleware, (req: Request, res: Response, next: NextFunction) => removeCartItem(req as any, res));
router.delete('/', authMiddleware, (req: Request, res: Response, next: NextFunction) => clearCart(req as any, res));

export default router; 