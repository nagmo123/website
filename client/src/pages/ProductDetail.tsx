import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Ruler, 
  Palette,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Eye
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../stores/useCartStore';
import ProductCard from '../components/Product/ProductCard';
import { API_BASE_URL } from '../api/config';
import { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customWidth, setCustomWidth] = useState(53);
  const [customHeight, setCustomHeight] = useState(10);
  const [showPreview, setShowPreview] = useState(false);
  const [previewRoom, setPreviewRoom] = useState('living-room');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        fetch(`${API_BASE_URL}/api/products`).then(r => r.json()).then(all => {
          setRelatedProducts(all.filter((p: Product) => p.tags[0] === data.category && (p.id || p._id) !== (data.id || data._id)).slice(0, 4));
        });
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      setCustomWidth(product.dimensions?.width || 53);
    }
  }, [product]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const totalArea = (customWidth * customHeight) / 929;

  const handleAddToCart = async () => {
    await addItem(product, quantity, {
      selectedColor,
      selectedMaterial,
      customDimensions: { width: customWidth, height: customHeight }
    });
    // Optionally, show feedback or refresh cart here
  };

  const roomMockups = [
    { id: 'living-room', name: 'Living Room', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 'bedroom', name: 'Bedroom', image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 'dining', name: 'Dining Room', image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Premium Wallpaper | WallArt</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary-600">Products</Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowPreview(true)}
                  className="absolute bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </motion.div>
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-primary-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                {product.bestseller && (
                  <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Bestseller
                  </span>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-gray-500">/sq ft</span>
                </div>
                <div className="text-sm text-gray-600">
                  Total: ${totalPrice.toFixed(2)} for {totalArea.toFixed(1)} sq ft
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color ({(product.colors ? product.colors.length : 0)} available)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(product.colors || []).map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Material
                  </label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select material</option>
                    {(product.materials || []).map(material => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Custom Dimensions (inches)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Width</label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Height</label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="text-sm font-medium">Free Shipping</div>
                    <div className="text-xs text-gray-500">On orders over $99</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="text-sm font-medium">30-Day Returns</div>
                    <div className="text-xs text-gray-500">Money back guarantee</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-primary-600" />
                  <div>
                    <div className="text-sm font-medium">Custom Sizes</div>
                    <div className="text-xs text-gray-500">Any dimension</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Preview in Room
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roomMockups.map(room => (
                  <div
                    key={room.id}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      previewRoom === room.id ? 'border-primary-600' : 'border-gray-200'
                    }`}
                    onClick={() => setPreviewRoom(room.id)}
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-white font-semibold">{room.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;