"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getReviews = exports.addReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = req.params.id;
        const user = req.user.id;
        // Prevent duplicate reviews by same user for same product
        const existing = await Review_1.default.findOne({ user, product });
        if (existing)
            return res.status(400).json({ message: 'You already reviewed this product' });
        const review = await Review_1.default.create({ user, product, rating, comment });
        res.status(201).json(review);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.addReview = addReview;
const getReviews = async (req, res) => {
    try {
        const product = req.params.id;
        const reviews = await Review_1.default.find({ product }).populate('user', 'name');
        res.json(reviews);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getReviews = getReviews;
const deleteReview = async (req, res) => {
    try {
        if (req.user.role !== 'admin')
            return res.status(403).json({ message: 'Admin only' });
        const review = await Review_1.default.findByIdAndDelete(req.params.reviewId);
        if (!review)
            return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteReview = deleteReview;
