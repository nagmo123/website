import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard';
import { FilterOptions, Product } from '../types';
import { API_BASE_URL } from '../api/config';

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
  const [visibleCount, setVisibleCount] = useState(9);
  const loaderRef = useRef<HTMLDivElement | null>(null);

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

  // Infinite scroll: load more when the loader is visible
  const handleObserver = useCallback((entries: Array<IntersectionObserverEntry>) => {
    const target = entries[0];
    if (target && target.isIntersecting) {
      setVisibleCount((prev) => Math.min(prev + 9, productsToShow.length));
    }
  }, [productsToShow.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  // Reset visibleCount when filters/search change
  useEffect(() => {
    setVisibleCount(9);
  }, [productsToShow]);

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
        {/* Header */}
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
                      onChange={(e) => setSortBy(e.target.value as any)}
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
                {productsToShow.slice(0, visibleCount).map((product, index) => {
                  // Only stagger delay for the first batch
                  const isFirstBatch = index < 9;
                  return (
                    <motion.div
                      key={product._id || product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: isFirstBatch ? index * 0.03 : 0 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  );
                })}
              </div>
              {/* Loader for infinite scroll */}
              {visibleCount < productsToShow.length && (
                <div ref={loaderRef} className="flex justify-center py-8">
                  <span className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 shadow">
                    <svg className="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                    Loading more...
                  </span>
                </div>
              )}

              {/* No Results */}
              {productsToShow.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search terms
                  </p>
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