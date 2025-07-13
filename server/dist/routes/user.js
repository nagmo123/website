"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = require("../controllers/user");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
router.get('/api/users', auth_1.authMiddleware, auth_1.adminMiddleware, user_1.getAllUsers); // admin
router.get('/api/users/customers', auth_1.authMiddleware, auth_1.adminMiddleware, user_1.getCustomers); // admin
router.get('/api/users/:id', auth_1.authMiddleware, user_1.getUserById); // admin/user
router.get('/api/users/:id/orders', auth_1.authMiddleware, user_1.getUserOrders); // admin/user
router.put('/api/users/:id', auth_1.authMiddleware, user_1.updateUser); // admin/user
router.delete('/api/users/:id', auth_1.authMiddleware, auth_1.adminMiddleware, user_1.deleteUser); // admin
exports.default = router;
