import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard';
import { FilterOptions, Product } from '../types';
import { API_BASE_URL } from '../api/config';

const PRODUCTS_PER_PAGE = 21;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [colors, setColors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest'>('popularity');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: [0, 200],
    colors: [],
    roomTypes: [],
    inStock: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        console.log('Fetched products:', data);
      });
    fetch(`${API_BASE_URL}/api/categories`).then(r => r.json()).then(data => {
      const uniqueCategories = Array.from(new Set(['All', ...data]));
      setCategories(uniqueCategories);
    });
    fetch(`${API_BASE_URL}/api/colors`).then(r => r.json()).then(data => setColors(data));
  }, []);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Defensive: default to empty array if null
      const colors = Array.isArray(product.colors) ? product.colors : [];
      const roomTypes = Array.isArray(product.roomTypes) ? product.roomTypes : [];

      // Only match products whose name starts with the search term (case-insensitive)
      const matchesSearch = searchTerm.trim() === '' || product.name.toLowerCase().startsWith(searchTerm.toLowerCase());

      // Change matchesCategory to filter by tags (theme) instead of category field
      const matchesCategory = !filters.category || filters.category === 'All' || (Array.isArray(product.tags) && product.tags.includes(filters.category));
      const matchesPrice = product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1];
      const matchesColors = !filters.colors?.length || filters.colors.some(color => colors.includes(color));
      const matchesRooms = !filters.roomTypes?.length || filters.roomTypes.some(room => roomTypes.includes(room));
      // Allow products with inStock === null or undefined if filter is on
      const matchesStock = !filters.inStock || product.inStock !== false;

      return matchesSearch && matchesCategory && matchesPrice && matchesColors && matchesRooms && matchesStock;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return filtered;
  }, [searchTerm, filters, sortBy, products]);

  // Debug: log filteredProducts
  console.log('filteredProducts:', filteredProducts);

  // Fallback: if filteredProducts is empty, show all products
  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  // Pagination logic
  const totalPages = Math.ceil(productsToShow.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = productsToShow.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [productsToShow]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev: FilterOptions) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'colors' | 'roomTypes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key]?.includes(value)
        ? prev[key].filter(item => item !== value)
        : [...(prev[key] || []), value]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Premium Wallpapers - Shop Collection | Nagomi</title>
        <meta name="description" content="Browse our extensive collection of premium wallpapers. Find the perfect design for your space with our advanced filtering options." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Premium Wallpapers
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform every wall into a masterpiece with our curated collection
              </p>
            </motion.div>
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-6">
              <a href="/" className="hover:text-primary-600">Home</a>
              <span>/</span>
              <span className="text-gray-900">Products</span>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search wallpapers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="relative">
                    <select
                      value={filters.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 max-h-48 overflow-y-auto"
                        size={categories.length > 8 ? 8 : undefined}
                        style={categories.length > 8 ? { overflowY: 'auto' } : {}}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => toggleArrayFilter('colors', color)}
                          className={`px-3 py-1 rounded-lg border-2 text-sm font-medium transition-all ${filters.colors?.includes(color) ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {productsToShow.length} results
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="popularity">Sort by Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {paginatedProducts.map((product, index) => {
                  // Only stagger delay for the first batch on each page
                  const isFirstBatch = index < 9;
                  return (
                    <motion.div
                      key={product._id || product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: isFirstBatch ? index * 0.03 : 0 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === page ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                  >
                    Next
                  </button>
                </div>
              )}

              {/* No Results */}
              {productsToShow.length === 0 && (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse flex flex-col"
                      style={{ minHeight: '420px' }}
                    >
                      <div className="w-full h-64 bg-gray-200" />
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-8 w-20 bg-gray-200 rounded" />
                          <div className="h-8 w-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;