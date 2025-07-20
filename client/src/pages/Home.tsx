import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/Product/ProductCard";
import { Product } from "../types";
import { API_BASE_URL } from "../api/config";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
    title: "Elegant Living Spaces",
    description: "Transform your home with our handcrafted furniture collections",
    cta: "Explore Collection"
  },
  {
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    title: "Artisan Craftsmanship",
    description: "Each piece tells a story of tradition and innovation",
    cta: "Discover Our Process"
  },
  {
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    title: "Sustainable Luxury",
    description: "Eco-friendly materials meet timeless design",
    cta: "Shop Sustainable"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  // Removed unused navigate
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);

  // Pick bestsellers or first 4 products as demo
  const bestsellers: Product[] = products.filter((p) => p.bestseller).slice(0, 4);
  const fallback: Product[] = products.slice(0, 4);
  const featured: Product[] = bestsellers.length > 0 ? bestsellers : fallback;

  // For Top Picks, pick 4 products that are not in featured
  const topPicks: Product[] = products.filter((p) => !featured.includes(p)).slice(0, 4);

  // Add category data for 'Shop by Category' section
  const shopCategories = [
    {
      name: 'Premium Wallpapers',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400',
    },
    {
      name: 'Designer Walls',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400',
    },
    {
      name: 'Signature Art',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400',
    },
    {
      name: 'Wall Muralists',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400',
    },
  ];

  // Removed unused getWatchLink

  // Testimonials carousel state
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const testimonials = [
    {
      name: 'Aarav Mehta',
      review: 'The transformation was magical! My living room feels like a luxury hotel now. Highly recommend Nagomi for anyone looking to elevate their space.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      stars: 5
    },
    {
      name: 'Saanvi Sharma',
      review: 'Absolutely in love with the Signature Art collection. The quality and detail are unmatched. The team was so helpful throughout the process!',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      stars: 5
    },
    {
      name: 'Kabir Singh',
      review: 'From consultation to installation, everything was seamless. The Designer Walls are a conversation starter for every guest!',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
      stars: 5
    },
    {
      name: 'Mira Kapoor',
      review: 'Nagomi turned my bedroom into a tranquil retreat. The muralists are true artists. I wake up inspired every day!',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      stars: 5
    },
  ];

  // Auto-advance carousel on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    const interval = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const { addItem } = useCartStore();

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#d9d9d9]">
      {/* Minimalist Hero Section with Moving Images */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center h-[70vh] min-h-[400px] w-full overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-white animate-gradient-move"
      >
        {/* Animated hero image slider in the background */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 z-0 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={idx !== currentSlide}
          >
            <img
              src={slide.image}
              alt="Hero background"
              className="w-full h-full object-cover object-center scale-105 blur-sm brightness-90"
              draggable="false"
            />
            <div className="absolute inset-0 bg-blue-900/30" />
        </div>
        ))}
        {/* Glassmorphism overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4"
        >
          <div className="backdrop-blur-md bg-white/60 rounded-3xl shadow-xl px-8 py-10 max-w-2xl mx-auto flex flex-col items-center animate-fade-slide-in">
            <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-serif text-4xl md:text-6xl font-bold text-blue-900 mb-4 text-center tracking-tight animate-fade-slide-in"
            >
              Transform Your Space with Nagomi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-sans text-lg md:text-2xl text-blue-700 mb-8 text-center animate-fade-slide-in delay-200"
            >
              Minimalist, modern, and soothing wallpapers for every mood. Discover the art of tranquility.
            </motion.p>
            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-300 focus:outline-none"
              style={{ boxShadow: '0 4px 32px 0 rgba(37, 99, 235, 0.10)' }}
              onClick={() => navigate('/products')}
            >
              Explore Designs
            </motion.button>
          </div>
        </motion.div>
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-600' : 'bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Shop by Category Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="py-20 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-8 pb-12 px-8">
            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-12 text-blue-900 tracking-tight relative"
            >
              Shop by Category
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
              {shopCategories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white group-hover:border-blue-300 transition-all duration-300"
                      />
                      {/* Animated 'New' badge for first category */}
                      {i === 0 && (
                        <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce z-10">
                          New
                        </span>
                      )}
                    </div>
                    <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="absolute inset-0 rounded-full" tabIndex={-1} aria-label={`Go to ${cat.name}`}></Link>
                  </div>
                  <span className="mt-6 text-lg font-semibold text-blue-800 text-center">
                    {cat.name}
                  </span>
          </motion.div>
            ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Top Picks Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="py-20 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-8 pb-12 px-8">
            <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-10 text-blue-900 tracking-tight relative"
            >
              Top Picks: Watch & Shop
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
              {topPicks.map((product: Product, i: number) => (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                  className="block group"
          >
            <Link
                    to={`/products/${product._id || product.id}`}
                    tabIndex={0}
                    aria-label={`View details for ${product.name}`}
                  >
                    <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-200 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300">
                      <div className="w-36 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center mb-4 relative">
                        {product.bestseller && (
                          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                            Bestseller
                          </span>
                        )}
                        <img
                          src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">{product.name}</h4>
                      <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">{product.description || 'No description'}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-blue-700">₹{product.price ?? 'N/A'}</span>
                        {product.originalPrice && (
                          <span className="text-base text-blue-300 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm shadow-sm">
                        Buy Now
                      </span>
                    </div>
            </Link>
          </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bestselling Products */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="py-20 px-4 w-full"
      >
        <div className="max-w-6xl mx-auto rounded-3xl shadow-xl bg-white border border-blue-100 relative">
          <div className="absolute left-0 top-0 w-full h-2 rounded-t-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
          <div className="pt-8 pb-12 px-8">
            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-2xl md:text-3xl font-bold text-left mb-10 text-blue-900 tracking-tight relative"
            >
              Transform Your Space Today
              <span className="block w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-2"></span>
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {featured.map((product: Product, i: number) => (
              <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.7 }}
                  className="block group"
                >
                  <Link
                    to={`/products/${product._id || product.id}`}
                    tabIndex={0}
                    aria-label={`View details for ${product.name}`}
                  >
                    <div className="bg-white border border-blue-100 rounded-2xl transition-all duration-200 p-6 w-full flex flex-col items-center group-hover:shadow-lg group-hover:border-blue-200 focus-within:shadow-lg focus-within:border-blue-300">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center mb-4 relative">
                        {product.bestseller && (
                          <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-600 animate-pulse z-10">
                            Bestseller
                          </span>
                        )}
                        <img
                          src={Array.isArray(product.images) && product.images.length > 0 ? `/images/${product.images[0].split('/').pop()}` : '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-bold text-lg text-blue-900 mt-4 mb-2 text-center line-clamp-2">{product.name}</h4>
                      <p className="text-blue-700 text-sm mb-4 text-center line-clamp-2">{product.description || 'No description'}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-blue-700">₹{product.price ?? 'N/A'}</span>
                        {product.originalPrice && (
                          <span className="text-base text-blue-300 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <button
                        className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm shadow hover:scale-105 transition-all duration-200"
                        onClick={async (e) => {
                          e.preventDefault();
                          await addItem(product, 1, {});
                          alert("Added to cart!");
                        }}
                      >
                        Add to Cart
                      </button>
                </div>
                  </Link>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative py-20 px-4 w-full bg-white"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-center text-xl md:text-2xl font-semibold text-primary-600 max-w-3xl mx-auto mb-10"
          >
            Nagomi draws its essence from the Japanese concept of harmony and tranquility. Inspired by nature’s beauty and the stories etched into every wall, we bring you thoughtfully curated wall designs that transform spaces into sanctuaries of peace and style
          </motion.p>

          {/* Trust/Ease/Beauty Banner */}
          <div className="relative flex justify-center w-screen mb-12 animate-fade-slide-in">
            <div className="w-screen flex flex-col md:flex-row rounded-none overflow-hidden shadow">
            {/* Ease */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#1428a0] text-white py-6 px-2 min-w-[220px] relative" style={{minHeight: '145px'}}>
              <img src="/ease-icon.png" alt="Ease Icon" className="w-[110px] h-[60px] object-contain mb-2" />
              <div className="flex items-center gap-2 mb-0 mt-1 relative">
                <span className="text-[2.7rem] font-serif font-normal leading-none">Ease</span>
                {/* Sparkles */}
                <span className="ml-1 flex gap-0.5">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v3M11 17v3M2 11h3M17 11h3M5.5 5.5l2.1 2.1M14.4 14.4l2.1 2.1M5.5 16.5l2.1-2.1M14.4 7.6l2.1-2.1" stroke="#fff" strokeWidth="1.2"/></svg>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.5 3.5l1.1 1.1M9.4 9.4l1.1 1.1M3.5 10.5l1.1-1.1M9.4 4.6l1.1-1.1" stroke="#fff" strokeWidth="1"/></svg>
                </span>
              </div>
              <div className="text-lg font-bold font-serif mt-1 text-center leading-tight" style={{textShadow: '0 1px 2px #0a1666'}}>
                <span className="block">End-to-end,</span>
                <span className="block">customizable service</span>
              </div>
            </div>
            {/* Beauty */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#d9d9d9] text-[#1428a0] py-6 px-2 min-w-[220px] relative" style={{minHeight: '145px'}}>
              <img src="/beauty-icon.png" alt="Beauty Icon" className="w-[110px] h-[60px] object-contain mb-2" />
              <div className="flex items-center gap-2 mb-0 mt-1 relative">
                <span className="text-[2.7rem] font-serif font-normal leading-none">Beauty</span>
                {/* Sparkles */}
                <span className="ml-1 flex gap-0.5">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v3M11 17v3M2 11h3M17 11h3M5.5 5.5l2.1 2.1M14.4 14.4l2.1 2.1M5.5 16.5l2.1-2.1M14.4 7.6l2.1-2.1" stroke="#1428a0" strokeWidth="1.2"/></svg>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.5 3.5l1.1 1.1M9.4 9.4l1.1 1.1M3.5 10.5l1.1-1.1M9.4 4.6l1.1-1.1" stroke="#1428a0" strokeWidth="1"/></svg>
                </span>
              </div>
              <div className="text-lg font-bold font-serif mt-1 text-center leading-tight" style={{textShadow: '0 1px 2px #fff'}}>
                <span className="block">Exclusive designs,</span>
                <span className="block">exceptional quality</span>
              </div>
            </div>
            {/* Trust */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#1428a0] text-white py-6 px-2 min-w-[220px] relative" style={{minHeight: '145px'}}>
              <img src="/trust-icon.png" alt="Trust Icon" className="w-[110px] h-[60px] object-contain mb-2" />
              <div className="flex items-center gap-2 mb-0 mt-1 relative">
                <span className="text-[2.7rem] font-serif font-normal leading-none">Trust</span>
                {/* Sparkles */}
                <span className="ml-1 flex gap-0.5">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v3M11 17v3M2 11h3M17 11h3M5.5 5.5l2.1 2.1M14.4 14.4l2.1 2.1M5.5 16.5l2.1-2.1M14.4 7.6l2.1-2.1" stroke="#fff" strokeWidth="1.2"/></svg>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.5 3.5l1.1 1.1M9.4 9.4l1.1 1.1M3.5 10.5l1.1-1.1M9.4 4.6l1.1-1.1" stroke="#fff" strokeWidth="1"/></svg>
                </span>
              </div>
              <div className="text-lg font-bold font-serif mt-1 text-center leading-tight" style={{textShadow: '0 1px 2px #0a1666'}}>
                <span className="block">2-year warranty,</span>
                <span className="block">dedicated support</span>
              </div>
            </div>
            </div>
          </div>

          {/* Move heading here */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-4xl font-bold text-center text-primary-600 mb-10 flex items-center justify-center gap-2"
          >
            <span className="text-3xl animate-heartbeat">♥</span> From Our Customers
          </motion.h3>
          <div className="flex flex-col md:flex-row md:gap-x-12 mb-12 w-full px-2 justify-center items-center">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.7 }}
                className={`flex-1 flex flex-col items-center bg-white shadow px-8 md:px-16 py-8 md:py-12 w-full min-w-[280px] md:min-w-[340px] min-h-[260px] md:min-h-[320px] h-full ${i === 0 ? 'rounded-l-2xl' : ''} ${i === testimonials.length - 1 ? 'rounded-r-2xl' : ''}`}
              >
                <div className="flex flex-col items-center w-full">
                  <div className="flex flex-col items-center mb-4">
                    <svg className="w-10 h-10 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 7h.01M15 7h.01M7 11h10M7 15h10" strokeLinecap="round" strokeLinejoin="round"/><text x="2" y="20" fontSize="32" fill="#3b82f6" fontFamily="serif">“</text></svg>
                    <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full border-2 border-blue-100 shadow" />
                  </div>
                  <div className="text-gray-700 text-lg text-center font-sans mb-2">{t.review}</div>
                  <div className="font-bold text-blue-900 text-base text-center mb-0">{t.name}</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.175 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  ))}
                </div>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mt-6 mx-auto" />
              </motion.div>
            ))}
          </div>
          {/* Simple carousel dots for mobile */}
          <div className="flex justify-center mt-8 gap-2 md:hidden">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${testimonialIdx === idx ? 'bg-blue-500' : 'bg-blue-200'}`}
                onClick={() => setTestimonialIdx(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Discover More Designs Section */}
          <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="py-16 px-6 bg-[#d9d9d9] w-full relative overflow-hidden"
      >
        <div className="container mx-auto">
          <div className="relative flex flex-col items-center mb-10">
            <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.7 }}
              className="relative z-10 text-4xl md:text-4xl font-bold text-center text-primary-600 "
              >
              Discover More Designs
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => !featured.includes(p) && !topPicks.includes(p)).slice(0, 4).map((product, i) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1 + i * 0.05, duration: 0.7 }}
                className="animate-fade-slide-in"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
            </div>
            </div>
          </motion.div>
      {/* Instagram Banner Section */}
      <section className="w-full bg-white py-10 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 mb-8">
            {/* Non-toxic & VOC Free */}
            <div className="flex flex-col items-center flex-1 min-w-[120px]">
              <img src="/non-toxic.png" alt="Non-toxic & VOC Free" className="w-16 h-16 object-contain mb-2" />
              <span className="text-[#1428a0] text-lg font-serif font-bold text-center leading-tight">Non-toxic &<br/>VOC Free</span>
            </div>
            {/* Custom Fit */}
            <div className="flex flex-col items-center flex-1 min-w-[120px]">
              <img src="/custom-fit.png" alt="Custom Fit" className="w-16 h-16 object-contain mb-2" />
              <span className="text-[#1428a0] text-lg font-serif font-bold text-center leading-tight">Custom<br/>Fit</span>
            </div>
            {/* Assured Quality */}
            <div className="flex flex-col items-center flex-1 min-w-[120px]">
              <img src="/assured-quality.png" alt="Assured Quality" className="w-16 h-16 object-contain mb-2" />
              <span className="text-[#1428a0] text-lg font-serif font-bold text-center leading-tight">Assured<br/>Quality</span>
            </div>
            {/* Secure Payment */}
            <div className="flex flex-col items-center flex-1 min-w-[120px]">
              <img src="/secure-payment.png" alt="Secure Payment" className="w-16 h-16 object-contain mb-2" />
              <span className="text-[#1428a0] text-lg font-serif font-bold text-center leading-tight">Secure<br/>Payment</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-[2.2rem] font-serif text-[#1428a0] font-normal mb-2">Our Instagram Feels Like Home.</div>
            <div className="text-[#1428a0] font-bold font-serif text-xl">@nagomi.walls</div>
          </div>
        </div>
      </section>
    </div>
  );
}