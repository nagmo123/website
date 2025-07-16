import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDb from './utils/db';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import userRoutes from './routes/user';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';
import metaRoutes from './routes/meta';
import customDesignRoutes from './routes/customDesign';
import uploadRoutes from './routes/upload';
import adminRoutes from './routes/admin';
import wishlistRoutes from './routes/wishlist';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const app = express();

// Request logger middleware
app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.url);
  next();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

connectDb();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      console.error('Bad JSON received:', err.message);
      return res.status(400).send({ message: 'Invalid JSON payload in request' });
    }
    next(err); // Pass other errors to the default error handler
});
// Disable ETag and remove Last-Modified to prevent 304 Not Modified issues
app.disable('etag');
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.removeHeader('Last-Modified');
    next();
});

app.use(express.json());

app.get('/test', (req, res) => res.json({ message: 'Root test works' }));
app.use('/api/auth/', authRoutes);
console.log('Registering /api/products route');
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', metaRoutes);
app.use('/api', customDesignRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', uploadRoutes);
app.use('/api', adminRoutes);
app.use('/api', wishlistRoutes);

// Stripe payment intent endpoint
app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount is required and must be a number.' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create payment intent.' });
  }
});

// Serve product image by SKU ID
app.get('/api/product-image/:skuId', (req, res) => {
  const { skuId } = req.params;
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const imagesDir = path.join(__dirname, 'images');
  let found = false;
  for (const ext of exts) {
    const filePath = path.join(imagesDir, skuId + ext);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
      found = true;
      break;
    }
  }
  if (!found) {
    res.status(404).json({ message: 'Image not found' });
  }
});

app.listen(PORT, () => {
    console.log('app is running at port: ', PORT);
}); 