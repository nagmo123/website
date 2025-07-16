"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = require("../controllers/user");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, user_1.getAllUsers); // admin
router.get('/customers', auth_1.authMiddleware, auth_1.adminMiddleware, user_1.getCustomers); // admin
router.get('/:id', auth_1.authMiddleware, user_1.getUserById); // admin/user
router.get('/:id/orders', auth_1.authMiddleware, user_1.getUserOrders); // admin/user
router.put('/:id', auth_1.authMiddleware, user_1.updateUser); // admin/user
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, user_1.deleteUser); // admin
export default router; 