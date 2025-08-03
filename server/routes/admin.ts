import express from 'express';
import { 
  getRevenue, 
  getOrderCount, 
  getProductCount, 
  getCustomerCount,
  getDashboardStats,
  getRecentOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  getAllProducts,
  getProductCategories,
  getAllCustomers,
  getCustomerDetails,
  getAnalytics,
  getAbandonedCarts,
  getProductInsights
} from '../controllers/admin';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard endpoints
router.get('/stats/revenue', getRevenue);
router.get('/stats/orders', getOrderCount);
router.get('/stats/products', getProductCount);
router.get('/stats/customers', getCustomerCount);
router.get('/dashboard/stats', getDashboardStats);
router.get('/orders/recent', getRecentOrders);

// Orders endpoints
router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderDetails);
router.patch('/orders/:orderId/status', updateOrderStatus);

// Products endpoints
router.get('/products', getAllProducts);
router.get('/products/categories', getProductCategories);

// Customers endpoints
router.get('/customers', getAllCustomers);
router.get('/customers/:customerId', getCustomerDetails);

// Analytics endpoints
router.get('/analytics', getAnalytics);
router.get('/abandoned-carts', getAbandonedCarts);
router.get('/product-insights', getProductInsights);

export default router; 