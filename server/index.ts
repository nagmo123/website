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
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const app = express();

// Request logger middleware
app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.url);
  next();
});

// Use the PORT environment variable for Render.com and other cloud hosts
const PORT = process.env.PORT || 4000;

connectDb();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
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
console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not set');
console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not set');
    
app.get('/test', (req, res) => res.json({ message: 'Root test works' }));
app.post('/test-payment', (req, res) => {
  console.log('=== TEST PAYMENT ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  res.json({ message: 'Test payment endpoint works', body: req.body });
});
app.use('/api/auth/', authRoutes);
console.log('Registering /api/products route');
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/custom-design', customDesignRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images'))); // <-- Add this line
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Razorpay order creation endpoint
app.post('/api/payment/create-order', async (req, res) => {
  console.log('=== PAYMENT ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    const { amount, currency = 'INR' } = req.body;
    console.log('Hello')
    // Debug: Check if environment variables are set
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return res.status(500).json({ error: 'Payment gateway not configured. Please contact support.' });
    }
    
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount is required and must be a number.' });
    }
    
    console.log('Creating Razorpay order with amount:', amount, 'currency:', currency);
    
    const options = {
      amount: Math.round(amount), // Amount should already be in paise from client
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };
    
    console.log('Razorpay options:', options);
    
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order.id);
    
    res.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    });
  } catch (err: any) {
    console.error('Razorpay error details:', {
      message: err.message,
      statusCode: err.statusCode,
      error: err.error,
      stack: err.stack
    });
    
    if (err.statusCode === 401) {
      res.status(500).json({ error: 'Payment gateway authentication failed. Please contact support.' });
    } else {
      res.status(500).json({ error: 'Failed to create payment order. Please try again.' });
    }
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
  console.log(`Server running on port ${PORT}`);
}); 