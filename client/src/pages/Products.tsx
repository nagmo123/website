import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/Product/ProductCard';
import { FilterOptions, Product } from '../types';
import { API_BASE_URL } from '../api/config';

const PRODUCTS_PER_PAGE = 21;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [colors, setColors] = useState<string[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);

  const [openSections, setOpenSections] = useState({
    type: false,
    colour: false,
    roomTypes: false
  });

  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'alphabetical' | ''>('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    priceRange: [0, 200],
    colors: [],
    materials: [],
    roomTypes: [],
    inStock: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'customised' | 'rolls'>('all');

  useEffect(() => {
    // Fetch products
    fetch(`${API_BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        console.log('Fetched products:', data);
        // Log first product structure for debugging
        if (data.length > 0) {
          console.log('Sample product structure:', data[0]);
          console.log('Sample product category:', data[0].category);
          console.log('Sample product colors:', data[0].colors);
          console.log('Sample product materials:', data[0].materials);
          console.log('Sample product roomTypes:', data[0].roomTypes);
          console.log('Sample product skuId:', data[0].skuId);
          console.log('Sample product id:', data[0].id);
          console.log('Sample product _id:', data[0]._id);
        }
      })
      .catch(err => console.error('Error fetching products:', err));

    // Fetch categories
    fetch(`${API_BASE_URL}/api/meta/categories`)
      .then(r => r.json())
      .then(data => {
        const uniqueCategories = Array.from(new Set(['All', ...data]));
        setCategories(uniqueCategories);
        console.log('Fetched categories:', uniqueCategories);
      })
      .catch(err => console.error('Error fetching categories:', err));

    // Fetch colors
    fetch(`${API_BASE_URL}/api/meta/colors`)
      .then(r => r.json())
      .then(data => {
        setColors(data);
        console.log('Fetched colors:', data);
      })
      .catch(err => console.error('Error fetching colors:', err));

    // Fetch room types
    fetch(`${API_BASE_URL}/api/meta/room-types`)
      .then(r => r.json())
      .then(data => {
        setRoomTypes(data);
        console.log('Fetched room types:', data);
      })
      .catch(err => console.error('Error fetching room types:', err));
  }, []);

  const filteredProducts = useMemo(() => {
    console.log('Filtering products with filters:', filters, 'Selected category:', selectedCategory);
    
    // First filter by category (Customised vs Rolls)
    let categoryFiltered = products;
    if (selectedCategory !== 'all') {
      console.log('Filtering by category:', selectedCategory);
      console.log('Total products:', products.length);
      
      // For testing, let's show first 5 products for customised and last 5 for rolls
      if (selectedCategory === 'customised') {
        categoryFiltered = products.slice(0, 5);
        console.log('Showing first 5 products for customised');
      } else if (selectedCategory === 'rolls') {
        categoryFiltered = products.slice(-5);
        console.log('Showing last 5 products for rolls');
      }
      
      console.log('Filtered products count:', categoryFiltered.length);
    }
    
    const filtered = categoryFiltered.filter(product => {
      // Defensive: default to empty array if null
      const productColors = Array.isArray(product.colors) ? product.colors : [];
      const productRoomTypes = Array.isArray(product.roomTypes) ? product.roomTypes : [];

      // Debug log for filter values
      console.log('Checking product:', product.name, 'Category:', product.category, 'Colors:', product.colors, 'RoomTypes:', product.roomTypes);

      // Case-insensitive category filter
      const matchesCategory =
        !filters.category ||
        filters.category === 'All' ||
        (product.category && product.category.toLowerCase() === filters.category.toLowerCase());

      // Case-insensitive color filter
      const matchesColors =
        !filters.colors?.length ||
        filters.colors.some(
          color => productColors.map(c => c.toLowerCase()).includes(color.toLowerCase())
        );

      // Case-insensitive room types filter
      const matchesRooms = 
        !filters.roomTypes?.length || 
        filters.roomTypes.some(
          room => productRoomTypes.map(r => r.toLowerCase()).includes(room.toLowerCase())
        );

      const matchesPrice = product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1];
      const matchesStock = !filters.inStock || product.inStock !== false;

      const isMatch = matchesCategory && matchesPrice && matchesColors && matchesRooms && matchesStock;
      
      // Debug: log which filters are matching
      if (filters.category !== 'All' || filters.colors?.length || filters.roomTypes?.length) {
        console.log(`Product "${product.name}":`, {
          matchesCategory,
          matchesColors,
          matchesRooms,
          matchesPrice,
          matchesStock,
          isMatch
        });
      }

      return isMatch;
    });

    // Sort products based on selected option, default to SKU ID sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          // First sort by SKU ID
          const skuComparison = (a.skuId || '').localeCompare(b.skuId || '');
          if (skuComparison !== 0) return skuComparison;
          // Then by price
          return a.price - b.price;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          // First sort by SKU ID
          const skuComparison = (a.skuId || '').localeCompare(b.skuId || '');
          if (skuComparison !== 0) return skuComparison;
          // Then by price
          return b.price - a.price;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => {
          // First sort by SKU ID
          const skuComparison = (a.skuId || '').localeCompare(b.skuId || '');
          if (skuComparison !== 0) return skuComparison;
          // Then by name
          return a.name.localeCompare(b.name);
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => {
          // First sort by SKU ID
          const skuComparison = (a.skuId || '').localeCompare(b.skuId || '');
          if (skuComparison !== 0) return skuComparison;
          // Then alphabetically by name
          return a.name.localeCompare(b.name);
        });
        break;
      case 'popularity':
        filtered.sort((a, b) => {
          // First sort by SKU ID
          const skuComparison = (a.skuId || '').localeCompare(b.skuId || '');
          if (skuComparison !== 0) return skuComparison;
          // Then by bestseller status
          return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        });
        break;
      default:
        // Default sorting: SKU ID only (when no sort option is selected)
        filtered.sort((a, b) => (a.skuId || '').localeCompare(b.skuId || ''));
    }

    return filtered;
  }, [filters, sortBy, products, selectedCategory]);

  // Debug: log filteredProducts and current filters
  console.log('Current filters:', filters);
  console.log('Available categories:', categories);
  console.log('Available colors:', colors);
  console.log('Available room types:', roomTypes);
  console.log('Total products:', products.length);
  console.log('Filtered products:', filteredProducts.length);
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
    console.log(`Changing ${key} filter to:`, value);
    setFilters((prev: FilterOptions) => {
      const newFilters = { ...prev, [key]: value };
      console.log('New filters state:', newFilters);
      return newFilters;
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleArrayFilter = (key: 'colors' | 'roomTypes' | 'materials', value: string) => {
    console.log(`Toggling ${key} filter with value:`, value);
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: prev[key]?.includes(value)
          ? prev[key].filter(item => item !== value)
          : [...(prev[key] || []), value]
      };
      console.log('New filters state:', newFilters);
      return newFilters;
    });
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
              <h1 className="text-4xl md:text-5xl font-bold text-[#172b9b] mb-4 font-seasons">
                Premium Wallpapers
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto italic font-bold
              ">
                with our <span className='text-xl max-w-2xl mx-auto italic font-bold text-[#ff3131]'>aesthetically</span> curated collection
              </p>
            </motion.div>
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-6">
              <a href="/" className="hover:text-primary-600">Home</a>
              <span>/</span>
              <span className="text-gray-900">Premium Wallpapers</span>
            </nav>
          </div>
        </div>
        
        {/* Category Selection */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center space-x-16">
            {/* Customised Wallpapers */}
            <div 
              className={`text-center cursor-pointer transition-all duration-200 hover:scale-105 ${selectedCategory === 'customised' ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
              onClick={() => setSelectedCategory('customised')}
            >
              <div className={`w-32 h-32 rounded-full border-2 bg-white mb-4 mx-auto flex items-center justify-center transition-all duration-200 ${selectedCategory === 'customised' ? 'border-[#172b9b] shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}>
                {/* Thumbnail placeholder - will be replaced with actual image */}
              </div>
              <h3 className={`font-bold underline font-lora transition-colors duration-200 ${selectedCategory === 'customised' ? 'text-[#172b9b]' : 'text-[#172b9b]'}`}>Customised Wallpapers</h3>
            </div>
            
            {/* Wallpaper Rolls */}
            <div 
              className={`text-center cursor-pointer transition-all duration-200 hover:scale-105 ${selectedCategory === 'rolls' ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
              onClick={() => setSelectedCategory('rolls')}
            >
              <div className={`w-32 h-32 rounded-full border-2 bg-white mb-4 mx-auto flex items-center justify-center transition-all duration-200 ${selectedCategory === 'rolls' ? 'border-[#172b9b] shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}>
                {/* Thumbnail placeholder - will be replaced with actual image */}
              </div>
              <h3 className={`font-bold underline font-lora transition-colors duration-200 ${selectedCategory === 'rolls' ? 'text-[#172b9b]' : 'text-[#172b9b]'}`}>Wallpaper Rolls</h3>
            </div>
          </div>
          
          {/* Show All Categories Option */}
          <div className="text-center mt-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-lg font-lora font-medium transition-all duration-200 ${selectedCategory === 'all' ? 'bg-[#172b9b] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Show All Categories
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white p-6 sticky top-24 max-h-[70vh] overflow-y-auto">
                {/* Results count */}
                <div className="text-gray-400 text-sm mb-4 font-lora">
                  {productsToShow.length} Results found
                </div>
                
                {/* Filters heading */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#172b9b] font-bold">Filters</h2>
                  <button
                    onClick={() => setFilters({
                      category: 'All',
                      priceRange: [0, 200],
                      colors: [],
                      roomTypes: [],
                      inStock: true,
                    })}
                    className="text-xs text-gray-500 hover:text-gray-700 font-lora"
                  >
                    Clear All
                  </button>
                </div>

                                <div className="space-y-0">
                  {/* SEARCH */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <label className="block text-[#545454] font-bold mb-2 font-lora">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search wallpapers..."
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-lora text-sm"
                      />
                    </div>
                  </div>

                  {/* THEME */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleSection('type')}
                      className="w-full flex items-center justify-between text-gray-700 font-medium font-lora"
                    >
                      Theme
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${openSections.type ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSections.type && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleFilterChange('category', 'All')}
                            className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.category === 'All' ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            No theme filter
                          </button>
                          {categories.filter(cat => cat !== 'All').map(category => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => handleFilterChange('category', category)}
                              className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.category === category ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COLOUR */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleSection('colour')}
                      className="w-full flex items-center justify-between text-gray-700 font-medium font-lora"
                    >
                      Colour
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${openSections.colour ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSections.colour && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {colors.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => toggleArrayFilter('colors', color)}
                              className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.colors?.includes(color) ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ROOM */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                      onClick={() => toggleSection('roomTypes')}
                      className="w-full flex items-center justify-between text-gray-700 font-medium font-lora"
                    >
                      Room
                      <svg 
                        className={`w-4 h-4 text-gray-400 transition-transform ${openSections.roomTypes ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSections.roomTypes && (
                      <div className="mt-3">
                        <div className="flex flex-col gap-2">
                          {roomTypes.map(roomType => (
                            <button
                              key={roomType}
                              type="button"
                              onClick={() => toggleArrayFilter('roomTypes', roomType)}
                              className={`text-left px-2 py-1 rounded text-sm font-medium transition-all font-lora ${filters.roomTypes?.includes(roomType) ? 'bg-gray-100 text-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              {roomType}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <span className="text-sm text-gray-600 font-lora">
                      {productsToShow.length} results
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-lora"
                    >
                      <option value="">Sort by</option>
                      <option value="popularity">Sort by Popularity</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="alphabetical">Sort Alphabetically</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mt-8">
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