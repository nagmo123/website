import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';

const navigation = [
  { name: 'Bestsellers', href: '/bestsellers' },
  { name: 'Shop Now', href: '/products' },
  { name: 'Custom Design', href: '/custom-design' },
  { name: 'About Us', href: '/about' },
];

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const { getTotalItems: getWishlistItems, toggleWishlist } = useWishlistStore();

  return (
    <>
      {/* Announcement Banner */}
      <div className="w-full">
        <div className="relative w-full h-8 flex items-center overflow-hidden" style={{background: 'linear-gradient(90deg, #2563eb 0%, #10b981 100%)'}}>
          {/* Marquee Text */}
          <div className="flex-1 h-full flex items-center overflow-hidden">
            <div
              className="whitespace-nowrap text-white font-bold italic animate-marquee px-4"
              style={{
                animation: 'marquee 30s linear infinite',
                minWidth: '100%',
              }}
            >
              Customisation & Installation Provided  |  FREE Shipping on Orders &gt; Rs. 3999
            </div>
          </div>
        </div>
      </div>
      {/* Main Navbar */}
      <nav className="bg-white backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center h-16 min-w-0">
            {/* Left side icons - Mobile only */}
            <div className="flex items-center space-x-1 md:hidden flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Search className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                className="relative p-1.5 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Heart className="w-4 h-4" />
                {getWishlistItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
              >
                    {getWishlistItems()}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Logo - Centered on mobile, left on desktop */}
            <Link to="/" className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              <img src="/logo.png" alt="Nagomi" className="h-12 w-auto md:h-12 flex-shrink-0" />
            </Link>

            {/* Desktop Navigation - Truly centered */}
            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-lora"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-0 md:space-x-0 flex-shrink-0 ml-auto -mr-4 md:-mr-20">
              {/* Desktop icons */}
              <div className="hidden md:flex items-center space-x-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {getWishlistItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {getWishlistItems()}
                  </motion.span>
                )}
              </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-1.5 md:p-2 text-gray-700 hover:text-primary-600 transition-colors -ml-1 md:-ml-2"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
              {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen((open) => !open)}
                    className="p-1.5 md:p-2 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none -ml-1 md:-ml-2"
                >
                    <User className="w-4 h-4 md:w-5 md:h-5" />
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
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block w-full text-left text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors"
                        >
                          Profile
                        </Link>
                        <Link 
                          to="/forgot-password" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 py-2 px-3 rounded-lg transition-colors"
                        >
                          Reset Password
                        </Link>
                      </div>
                      <button
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="mt-2 w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Logout
                      </button>
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
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-lora"
              >
                  Login
                </Link>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Categories */}
      <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-between py-3 overflow-x-auto">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                className="flex-shrink-0 px-3 py-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors whitespace-nowrap"
              >
                {item.name}
                  </Link>
                ))}
              </div>
        </div>
      </div>

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