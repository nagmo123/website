"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var order_1 = require("../controllers/order");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.get('/api/orders', auth_1.authMiddleware, order_1.getAllOrders); // user/admin
router.get('/api/orders/export', auth_1.authMiddleware, auth_1.adminMiddleware, order_1.exportOrders); // admin
router.get('/api/orders/:id', auth_1.authMiddleware, order_1.getOrderById); // user/admin
router.post('/api/orders', auth_1.authMiddleware, order_1.createOrder); // user
router.put('/api/orders/:id', auth_1.authMiddleware, auth_1.adminMiddleware, order_1.updateOrder); // admin
router.delete('/api/orders/:id', auth_1.authMiddleware, auth_1.adminMiddleware, order_1.deleteOrder); // admin
router.post('/api/orders/:id/pay', auth_1.authMiddleware, order_1.payOrder); // user/admin
exports.default = router;
