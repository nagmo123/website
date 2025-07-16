import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  skuId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category?: string;
  colors?: string[];
  materials?: string[];
  dimensions?: {
    width?: number;
    height?: number;
  };
  tags?: string[];
  bestseller?: boolean;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  roomTypes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new mongoose.Schema({
  skuId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
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

export default mongoose.model<IProduct>('Product', ProductSchema); 