import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    await addItem(product, 1, {});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Defensive: handle missing/null images
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? `/images/${product.images[0].split('/').pop()}`
    : '/placeholder.jpg';

  // Debug log
  console.log('ProductCard:', product.name, imageUrl);

  // Defensive: handle missing/null colors
  const colors = Array.isArray(product.colors) ? product.colors : [];

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        whileHover={{ y: -8, scale: 1.03 }}
        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-100"
    >
        <Link to={`/products/${product._id || product.id}`} className="block">
        <div className="relative overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              whileHover={{ scale: 1.12 }}
          />
          
          {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.bestseller && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse">
                Bestseller
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </motion.button>

          {/* Quick Add to Cart */}
          <motion.button
              initial={{ opacity: 1, y: 0 }}
            whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
              <span className="ripple-effect"></span>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-primary-600 font-bold"> 999 per square feet</p>
          </div>

          <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-4">
            {colors.slice(0, 3).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: color ? color.toLowerCase() : '#ccc' }}
              />
            ))}
            {colors.length > 3 && (
              <span className="text-xs text-gray-500">
                +{colors.length - 3} more
              </span>
            )}
            {colors.length === 0 && <span className="text-xs text-gray-400">N/A</span>}
            </div>
          </div>
        </Link>
      </motion.div>
      
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span className="font-semibold">Successfully added</span>
        </div>
      )}
    </>
  );
};

export default ProductCard;