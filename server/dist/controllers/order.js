"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportOrders = exports.payOrder = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getAllOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
const json2csv_1 = require("json2csv");
const getAllOrders = async (req, res) => {
    try {
        let filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.customer)
            filter.user = req.query.customer;
        if (req.query.startDate && req.query.endDate) {
            filter.createdAt = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
        }
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order_1.default.find(filter).populate('user items.product');
        }
        else {
            orders = await Order_1.default.find({ ...filter, user: req.user.id }).populate('items.product');
        }
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllOrders = getAllOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id).populate('user items.product');
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const cart = await Cart_1.default.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const order = await Order_1.default.create({
            user: req.user.id,
            items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedMaterial: item.selectedMaterial,
            })),
            total,
            status: 'pending',
        });
        cart.items = [];
        await cart.save();
        res.status(201).json(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createOrder = createOrder;
const updateOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }
        const order = await Order_1.default.findByIdAndDelete(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteOrder = deleteOrder;
const payOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        order.status = 'paid';
        await order.save();
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.payOrder = payOrder;
const exportOrders = async (req, res) => {
    try {
        let filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.customer)
            filter.user = req.query.customer;
        if (req.query.startDate && req.query.endDate) {
            filter.createdAt = { $gte: new Date(req.query.startDate), $lte: new Date(req.query.endDate) };
        }
        const orders = await Order_1.default.find(filter).populate('user items.product');
        const fields = ['_id', 'user.name', 'total', 'status', 'createdAt'];
        const parser = new json2csv_1.Parser({ fields });
        const csv = parser.parse(orders);
        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.exportOrders = exportOrders;
