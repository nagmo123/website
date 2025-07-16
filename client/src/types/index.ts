export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  colors: string[];
  materials: string[];
  dimensions: {
    width: number;
    height: number;
  };
  tags: string[];
  bestseller?: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
  roomTypes: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMaterial?: string;
  customDimensions?: {
    width: number;
    height: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  colors?: string[];
  materials?: string[];
  roomTypes?: string[];
  inStock?: boolean;
}