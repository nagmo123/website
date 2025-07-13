"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [String],
    category: String,
    colors: [String],
    materials: [String],
    dimensions: {
        width: Number,
        height: Number,
    },
    tags: [String],
    bestseller: Boolean,
    rating: Number,
    reviews: Number,
    inStock: Boolean,
    roomTypes: [String],
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', ProductSchema);
