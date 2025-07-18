import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCartStore } from '../../stores/useCartStore';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addItem(product, 1, {});
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
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
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.bestseller && (
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
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

        <div className="p-6">
          {/* Category Badge */}
          {product.category && (
            <span className="inline-block mb-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
              {product.category}
            </span>
          )}
          {/* Theme (Tags) */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Theme:</span> {product.tags.join(', ')}
            </div>
          )}
          {/* Material */}
          {product.materials && product.materials.length > 0 && (
            <div className="mb-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Material:</span> {product.materials.join(', ')}
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{product.rating ?? 'N/A'}</span>
            </div>
            <span className="text-gray-400 text-sm">({product.reviews ?? 'N/A'})</span>
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description || 'No description'}
          </p>

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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-400 line-through">
                ₹199
              </span>
              <span className="text-2xl font-bold text-primary-600">
                ₹99
              </span>
              <span className="text-sm text-gray-500">per sqft onwards</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;