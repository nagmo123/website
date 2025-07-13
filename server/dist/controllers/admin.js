"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentOrders = exports.getCustomerCount = exports.getProductCount = exports.getOrderCount = exports.getRevenue = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const getRevenue = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ status: { $in: ['paid', 'shipped', 'delivered'] } });
        const revenue = orders.reduce((sum, o) => sum + o.total, 0);
        res.json({ revenue });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getRevenue = getRevenue;
const getOrderCount = async (req, res) => {
    try {
        const count = await Order_1.default.countDocuments();
        res.json({ count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getOrderCount = getOrderCount;
const getProductCount = async (req, res) => {
    try {
        const count = await Product_1.default.countDocuments();
        res.json({ count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getProductCount = getProductCount;
const getCustomerCount = async (req, res) => {
    try {
        const count = await User_1.default.countDocuments({ role: 'customer' });
        res.json({ count });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getCustomerCount = getCustomerCount;
const getRecentOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email');
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getRecentOrders = getRecentOrders;
