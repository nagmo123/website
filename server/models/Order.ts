import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

export interface CardInfo {
  brand: string;
  last4: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingInfo: ShippingInfo;
  cardInfo: CardInfo;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  selectedColor: String,
  selectedMaterial: String,
}, { _id: false });

const ShippingInfoSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
}, { _id: false });

const CardInfoSchema: Schema = new mongoose.Schema({
  brand: { type: String, required: true },
  last4: { type: String, required: true },
}, { _id: false });

const OrderSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingInfo: { type: ShippingInfoSchema, required: true },
  cardInfo: { type: CardInfoSchema, required: true },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema); 