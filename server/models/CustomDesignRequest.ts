import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomDesignRequest extends Document {
  name: string;
  email: string;
  roomType: string;
  dimensions: {
    width: number;
    height: number;
  };
  style: string;
  budget: string;
  description: string;
  inspirationImages: string[];
  submittedAt: Date;
}

const CustomDesignRequestSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roomType: { type: String, required: true },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  style: { type: String, required: true },
  budget: { type: String, required: true },
  description: { type: String, required: true },
  inspirationImages: [String],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICustomDesignRequest>('CustomDesignRequest', CustomDesignRequestSchema); 