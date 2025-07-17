import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw,
} from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Products',
      links: [
        { name: 'Botanical Wallpapers', href: '/products?category=botanical' },
        { name: 'Tropical Designs', href: '/products?category=tropical' },
        { name: 'Luxury Collection', href: '/products?category=luxury' },
        { name: 'Modern Minimalist', href: '/products?category=modern' },
        { name: 'Custom Design', href: '/custom-design' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Installation Guide', href: '/installation' },
        { name: 'Measuring Guide', href: '/measuring' },
        { name: 'Care Instructions', href: '/care' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Press', href: '/press' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Shipping Policy', href: '/shipping' },
        { name: 'Return Policy', href: '/returns' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $99',
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '30-day money back',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: 'Hassle-free process',
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'SSL encrypted checkout',
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section with Parallax */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-emerald-400/10 to-indigo-900/10 animate-parallax" style={{ backgroundPosition: '0 0', backgroundSize: '200% 200%', zIndex: 0 }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: 'loop', delay: index * 0.2 }}
                  className="bg-primary-600 p-3 rounded-lg shadow-lg"
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg text-primary-400">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold">Nagomi</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Transform your space with Nagomi’s premium wallpapers. From botanical bliss to modern minimalism, we have the perfect design for every home.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-primary-200">123 Harmony Lane, Tokyo, Japan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-primary-200">+81 3-1234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-primary-200">hello@nagomi.walls</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-primary-400">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-300">
                Get the latest updates on new products and exclusive offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col lg:flex-row items-center justify-between border-t border-gray-800 pt-8">
          <p className="text-primary-200 text-sm">
            © 2024 Nagomi. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 lg:mt-0">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ scale: 1.2, color: '#34d399', filter: 'drop-shadow(0 0 8px #34d399)' }}
                whileTap={{ scale: 0.9 }}
                className="text-primary-200 hover:text-emerald-400 transition-colors pulse-on-hover"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;