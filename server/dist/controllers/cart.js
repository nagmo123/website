"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const getCart = async (req, res) => {
    try {
        let cart = await Cart_1.default.findOne({ user: req.user.id }).populate('items.product');
        if (!cart)
            cart = await Cart_1.default.create({ user: req.user.id, items: [] });
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, selectedColor, selectedMaterial } = req.body;
        const product = await Product_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        let cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart)
            cart = await Cart_1.default.create({ user: req.user.id, items: [] });
        const existing = cart.items.find((item) => item.product.equals(productId) && item.selectedColor === selectedColor && item.selectedMaterial === selectedMaterial);
        if (existing) {
            existing.quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity, selectedColor, selectedMaterial });
        }
        await cart.save();
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        let cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found' });
        const item = cart.items.find((item) => item._id?.toString() === req.params.itemId);
        if (!item)
            return res.status(404).json({ message: 'Item not found' });
        if (quantity <= 0) {
            cart.items = cart.items.filter((item) => item._id?.toString() !== req.params.itemId);
        }
        else {
            item.quantity = quantity;
        }
        await cart.save();
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (req, res) => {
    try {
        let cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter((item) => item._id?.toString() !== req.params.itemId);
        await cart.save();
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.removeCartItem = removeCartItem;
const clearCart = async (req, res) => {
    try {
        let cart = await Cart_1.default.findOne({ user: req.user.id });
        if (!cart)
            return res.status(404).json({ message: 'Cart not found' });
        cart.items = [];
        await cart.save();
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.clearCart = clearCart;
