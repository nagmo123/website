import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
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

export default mongoose.model<IProduct>('Product', ProductSchema); 