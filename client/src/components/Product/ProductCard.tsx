import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useAuthStore } from '../../stores/useAuthStore';
import { useWishlistStore } from '../../stores/useWishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlistStore();

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addToWishlist(product);
  };

  // Defensive: handle missing/null images
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? `/images/${product.images[0].split('/').pop()}`
    : '/placeholder.jpg';

  // Debug log
  console.log('ProductCard:', product.name, imageUrl);

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
            onClick={handleAddToWishlist}
          >
            <Heart className={`w-5 h-5 ${isInWishlist((product.id || product._id || '')) ? 'text-red-500' : 'text-gray-600'}`} />
          </motion.button>


        </div>

          <div className="p-4 pb-4">
            <h3 className="font-bold text-[#172b9b] mb-2 line-clamp-2">{product.name}</h3>
            <p className="font-bold italic text-[#545454]">
              <span className="line-through">₹119</span> ₹99 per square feet
            </p>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default ProductCard;