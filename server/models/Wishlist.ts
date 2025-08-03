import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
}, { 
  timestamps: true,
  // Ensure a user can only add a product once to their wishlist
  indexes: [
    { userId: 1, productId: 1, unique: true }
  ]
});

export default mongoose.model<IWishlist>('Wishlist', WishlistSchema); 