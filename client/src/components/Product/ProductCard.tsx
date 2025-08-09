import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useAuthStore } from '../../stores/useAuthStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, checkWishlistStatus } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  // Check wishlist status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const productId = product._id || product.id;
      if (!productId) return;
      
      if (user) {
        setIsLoadingWishlist(true);
        try {
          const status = await checkWishlistStatus(productId);
          setIsWishlisted(status);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        } finally {
          setIsLoadingWishlist(false);
        }
      } else {
        // For non-logged in users, check local state
        setIsWishlisted(isInWishlist(productId));
      }
    };

    checkStatus();
  }, [user, product._id, product.id, checkWishlistStatus, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    const productId = product._id || product.id;
    if (!productId) return;

    setIsLoadingWishlist(true);
    if (isWishlisted) {
      setIsWishlisted(false); // Optimistic update
      removeFromWishlist(productId).catch((error) => {
        setIsWishlisted(true); // Revert if error
        console.error('Error removing from wishlist:', error);
      }).finally(() => setIsLoadingWishlist(false));
    } else {
      setIsWishlisted(true); // Optimistic update
      addToWishlist(product).catch((error) => {
        setIsWishlisted(false); // Revert if error
        console.error('Error adding to wishlist:', error);
      }).finally(() => setIsLoadingWishlist(false));
    }
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
            onClick={handleWishlistToggle}
            disabled={isLoadingWishlist}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
            } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>

        </div>

          <div className="p-4">
            <h3 className="font-bold text-[#172b9b] mb-2 line-clamp-2">{product.name}</h3>
            <p className="font-bold italic text-[#545454]">
              <span className="font-bold italic text-[#545454] line-through">₹119</span> ₹99 per square feet
            </p>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default ProductCard;