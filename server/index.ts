import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDb from './utils/db';
import path from 'path';
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

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

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

app.use('/api/auth', authRoutes);
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

app.listen(PORT, () => {
    console.log('app is running at port: ', PORT);
}); 