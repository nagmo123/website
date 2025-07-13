"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const Product_1 = __importDefault(require("../models/Product"));
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist_1.default.findOne({ user: req.user.id }).populate('products');
        if (!wishlist)
            wishlist = await Wishlist_1.default.create({ user: req.user.id, products: [] });
        res.json(wishlist.products);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product_1.default.findById(productId);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        let wishlist = await Wishlist_1.default.findOne({ user: req.user.id });
        if (!wishlist)
            wishlist = await Wishlist_1.default.create({ user: req.user.id, products: [] });
        if (!wishlist.products.includes(productId))
            wishlist.products.push(productId);
        await wishlist.save();
        res.json(wishlist.products);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist_1.default.findOne({ user: req.user.id });
        if (!wishlist)
            return res.status(404).json({ message: 'Wishlist not found' });
        wishlist.products = wishlist.products.filter((id) => id.toString() !== req.params.productId);
        await wishlist.save();
        res.json(wishlist.products);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.removeFromWishlist = removeFromWishlist;
