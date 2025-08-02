import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '../stores/useCartStore';
import ProductCard from '../components/Product/ProductCard';
import { API_BASE_URL } from '../api/config';
import { Product } from '../types';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaFlask, FaRulerCombined, FaStar, FaClock } from 'react-icons/fa';
import { useWishlistStore } from '../stores/useWishlistStore';

// Add a Review type for local state
interface Review {
  rating: number;
  comment?: string;
  user?: { name?: string };
}

const faqs = [
  {
    q: "Why do I have to share ‘Material’ and ‘Wall Size’?",
    a: "We need your wall size and preferred material to ensure your wallpaper fits perfectly and is printed on the right substrate for your needs."
  },
  {
    q: "What happens after I place an order?",
    a: "After you place an order, our team will review your details, confirm your requirements, and begin production. You'll receive updates and tracking information as your order progresses."
  },
  {
    q: "Are wallpapers easy to clean and durable?",
    a: "Yes! Our wallpapers are designed to be durable and easy to clean with a damp cloth. They are also resistant to fading and peeling."
  },
  {
    q: "Do you provide customisation? Can I share a design?",
    a: "Absolutely! You can share your own design or request customizations. Our design team will work with you to create your perfect wallpaper."
  },
  {
    q: "How to ensure my wall is ready for wallpaper?",
    a: "Make sure your wall is clean, dry, smooth, and free from dust or loose paint. If you need help, our team can guide you through the preparation process."
  },
  {
    q: "What are the payment options available?",
    a: "We accept all major credit/debit cards, UPI, net banking, and select wallets for your convenience."
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity] = useState(1);
  const [customWidth, setCustomWidth] = useState(53);
  const [customHeight, setCustomHeight] = useState(10);
  const [showPreview, setShowPreview] = useState(false);
  const [previewRoom, setPreviewRoom] = useState('living-room');
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const reviewRef = useRef<HTMLDivElement>(null);
  const { addToWishlist, isInWishlist } = useWishlistStore();

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

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/api/reviews/${id}`)
      .then(r => r.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id, reviewSuccess]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-seasons">Product Not Found</h1>
          <Link to="/products" className="text-primary-600 hover:underline font-lora">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const totalArea = (customWidth * customHeight) / 929;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addItem(product, quantity, {
      selectedMaterial,
      customDimensions: { width: customWidth, height: customHeight }
    });
    // Optionally, show feedback or refresh cart here
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addToWishlist(product);
  };

  const roomMockups = [
    { id: 'living-room', name: 'Living Room', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 'bedroom', name: 'Bedroom', image: 'https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 'dining', name: 'Dining Room', image: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ];

  function toAbsoluteUrl(url: string) {
    if (!url) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (url.startsWith('http')) return url;
    return `${window.location.origin}${url}`;
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(toAbsoluteUrl)
    : ['https://via.placeholder.com/400x400?text=No+Image'];
  const mainImage = images[selectedImageIndex] || 'https://via.placeholder.com/400x400?text=No+Image';
  console.log('Product images:', product.images, 'Selected:', images[selectedImageIndex]);

  // Placeholder for delivery date
  const deliveryDate = 'Friday, 10th January';
  // Placeholder for discount
  const discountPercent = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  // Placeholder for WhatsApp link
  const whatsappLink = `https://wa.me/?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}`;

  // Add review submit handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(null);
    if (!user) {
      setReviewError('You must be logged in to write a review.');
      setReviewLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }
      setReviewSuccess('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      // Scroll to reviews
      setTimeout(() => {
        reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setReviewError(err.message || 'Failed to submit review');
      } else {
        setReviewError('Failed to submit review');
      }
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Premium Wallpaper | Nagomi</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 font-lora">
              <Link to="/" className="hover:text-primary-600">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary-600">Products</Link>
              <span>/</span>
              <span className="text-gray-900 font-seasons">{product.name}</span>
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
                  src={mainImage}
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
                  {images.map((image, index) => (
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
                    BESTSELLER
                  </span>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="italic text-lg text-gray-700 mb-2 font-lora">Infuse your home with the vibrant energy of nature's wild beauty</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center text-yellow-500 text-xl"><Star className="w-5 h-5 fill-current" /> {product.rating ?? 'N/A'}</span>
                  <span className="text-blue-800 underline cursor-pointer text-sm font-lora">{product.reviews ?? 0} reviews</span>
                  <span className="ml-2 cursor-pointer" title="When clicking on question mark a message should come">❓</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-blue-900 border border-blue-900 px-2 py-1 rounded font-seasons">₹99 <span className="text-base font-normal font-lora">per square feet</span></span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through font-lora">₹120 per square feet</span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded ml-2 font-bold font-lora">SAVE {discountPercent}%</span>
                  )}
                </div>
                <div className="text-xs text-gray-700 mb-2 font-lora">inclusive of all taxes</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500 font-lora">When clicking on question mark a message should come</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-lora">Material <span className="text-blue-800 underline cursor-pointer">(Guide)</span></label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-lora"
                  >
                    <option value="">Non-woven</option>
                    {(product.materials || []).map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                  <div className="text-xs text-green-900 bg-green-200 rounded px-2 py-1 mt-2 font-lora">10 different materials, price per sqft above to change as per material selected</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-lora">Wall Size <span className="text-blue-800 underline cursor-pointer">(Guide)</span></label>
                  <div className="flex gap-2 items-end">
                <div>
                      <label className="block text-xs text-gray-500 mb-1 font-lora">Height</label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-400 rounded font-lora"
                        min={1}
                      />
                      <span className="ml-1 text-xs font-lora">inches</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-lora">Width</label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-400 rounded font-lora"
                        min={1}
                      />
                      <span className="ml-1 text-xs font-lora">inches</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-700 mt-1 font-lora">Total Area: {totalArea.toFixed(1)} square feet</div>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-gray-700 font-lora">Need help placing the order? <a href="#" className="text-blue-800 underline">Click here</a></span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-lora">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-400 rounded font-lora"
                  />
                  <div className="text-xs text-gray-700 mt-1 font-lora">Expected delivery by <span className="font-semibold">{deliveryDate}</span></div>
                  <div className="text-xs text-gray-700 bg-gray-200 rounded px-2 py-1 mt-1 inline-block font-lora">Hard code to current day+3</div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeInstallation}
                    onChange={() => setIncludeInstallation(v => !v)}
                    className="w-5 h-5"
                    id="install-checkbox"
                  />
                  <label htmlFor="install-checkbox" className="text-sm font-medium text-gray-700 font-lora">Include installation (₹10/square feet)</label>
                  <span className="text-xs text-gray-500 bg-gray-200 rounded px-2 py-1 ml-2 font-lora">Only show if we have installation service in that pincode. Keep it checked by default</span>
                    </div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-900 border border-blue-900 px-2 py-1 rounded font-seasons">Final Price: <span className="line-through text-gray-400 font-lora">₹120 per square feet</span> ₹{(99 * (includeInstallation ? 1.1 : 1)).toFixed(0)} per square feet</span>
                  </div>
                  <div className="text-xs text-gray-700 font-lora">inclusive of all taxes</div>
                </div>
                <div className="mb-4 text-green-700 font-semibold font-lora">YAY! You are eligible for free shipping!</div>
                <div className="flex gap-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                    className="flex-1 bg-blue-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <FaWhatsapp className="w-6 h-6" />
                    Order on WhatsApp
                  </a>
                <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors" onClick={handleAddToWishlist}>
                  <Heart className={`w-6 h-6 ${isInWishlist(product.id || product._id) ? 'text-red-500' : ''}`} />
                </button>
              </div>
                <div className="flex flex-wrap gap-6 mt-8 justify-center border-t pt-6">
                  <div className="flex flex-col items-center text-blue-900">
                    <FaFlask className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">Non-toxic & VOC Free</span>
                  </div>
                  <div className="flex flex-col items-center text-blue-900">
                    <FaRulerCombined className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">Custom Fitting</span>
                </div>
                  <div className="flex flex-col items-center text-blue-900">
                    <FaStar className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">High Quality Print</span>
                  </div>
                  <div className="flex flex-col items-center text-blue-900">
                    <FaClock className="w-8 h-8 mb-1" />
                    <span className="text-xs font-semibold">Lasts 8-10 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-seasons">
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
        {/* FAQ, Customers Also Bought, Recently Viewed, Reviews */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6 font-seasons">Frequently Asked Questions (FAQs)</h2>
            <div className="max-w-2xl mx-auto">
              <ul className="space-y-3 text-lg text-gray-800 font-lora">
                {faqs.map((faq, i) => (
                  <li key={i} className="border-b pb-2">
                    <button
                      className="w-full text-left flex justify-between items-center focus:outline-none"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-seasons">{faq.q}</span>
                      <span className="ml-2 text-blue-900 font-bold">{openFaq === i ? '-' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="mt-2 text-base text-gray-600 animate-fade-in font-lora">
                        {faq.a}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Customers Also Bought */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6 font-seasons">Customers Also Bought</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-36 h-36 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Recently Viewed */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6 font-seasons">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-36 h-36 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto" ref={reviewRef}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4 flex flex-col items-center justify-center mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-blue-900 mb-2 font-seasons">Reviews</h2>
                <div className="text-3xl font-bold text-yellow-500 mb-1 font-seasons">{product.rating ?? 'N/A'}</div>
                <div className="text-sm text-gray-600 mb-2 font-lora">Based on {product.reviews ?? 0} reviews</div>
              </div>
              <div className="flex-1 space-y-4">
                {reviews.length === 0 && <div className="text-gray-500 font-lora">No reviews yet.</div>}
                {reviews.map((r, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold font-lora">{r.rating}</span>
                      <span className="text-gray-700 ml-2 font-lora">{r.user?.name || 'Anonymous'}</span>
                    </div>
                    <div className="text-gray-800 font-lora">{r.comment}</div>
                  </div>
                ))}
                {/* Inline review form */}
                <form onSubmit={handleReviewSubmit} className="bg-white border-t pt-6 mt-6">
                  <h3 className="text-lg font-bold mb-2 font-seasons">Write a Review</h3>
                  {reviewError && <div className="text-red-600 mb-2 font-lora">{reviewError}</div>}
                  {reviewSuccess && <div className="text-green-600 mb-2 font-lora">{reviewSuccess}</div>}
                  <div className="flex items-center gap-4 mb-2">
                    <label className="font-semibold font-lora">Rating:</label>
                    <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="border rounded px-2 py-1">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2 font-lora"
                    rows={3}
                    placeholder="Share your experience..."
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60 font-lora"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 font-seasons">
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
                      <span className="text-white font-semibold font-lora">{room.name}</span>
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