import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Home,
  Grid3X3,
  Palette,
  Info,
} from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems, toggleCart } = useCartStore();
  const { user } = useAuthStore();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Grid3X3 },
    { name: 'Custom Design', href: '/custom-design', icon: Palette },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Announcement Banner */}
      <div className="w-full">
        <div className="relative w-full h-8 flex items-center overflow-hidden" style={{background: 'linear-gradient(90deg, #2563eb 0%, #10b981 100%)'}}>
          {/* Marquee Text */}
          <div className="flex-1 h-full flex items-center overflow-hidden">
            <div
              className="whitespace-nowrap text-white font-semibold text-sm animate-marquee px-4"
              style={{
                animation: 'marquee 18s linear infinite',
                minWidth: '100%',
              }}
            >
              Customisation & Installation Provided  |  FREE Shipping on Orders &gt; Rs. 3999
            </div>
          </div>
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919999999999" // Replace with your WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/90 hover:bg-white text-green-600 font-semibold text-sm px-3 py-1 rounded-full shadow transition ml-2 mr-4"
            style={{whiteSpace: 'nowrap'}}
          >
            <FaWhatsapp className="w-4 h-4" />
            Contact Us
          </a>
        </div>
      </div>
      {/* Main Navbar */}
      <nav className="bg-white backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-lg flex items-center justify-center"
              >
                <img src="/logo.png" alt="Nagomi Logo" className="w-full h-full object-contain" />
              </motion.div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>

              {/* User Account */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((open) => !open)}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none"
                >
                  <User className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isProfileOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 p-4 flex flex-col gap-2"
                    >
                      <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                      <div className="text-sm text-gray-600 truncate">{user.email}</div>
                    </motion.div>
                  )}
                  {isProfileOpen && !user && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 p-4 flex flex-col gap-2"
                    >
                      <Link to="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-4">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search wallpapers..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;