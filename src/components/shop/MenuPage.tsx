import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Star, ShoppingBag, Eye, X, Sparkles, Check, ChevronDown } from 'lucide-react';
import { Product, ProductCategory } from '../../types.js';
import { useCart } from '../../context/CartContext.js';
import { useToast } from '../../context/ToastContext.js';

interface MenuPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: ProductCategory | 'All';
}

const CATEGORIES: { id: ProductCategory | 'All'; label: string; icon: string }[] = [
  { id: 'All', label: 'All Treats', icon: '✨' },
  { id: 'Birthday Cakes', label: 'Birthday Cakes', icon: '🎂' },
  { id: 'Cheesecakes', label: 'Cheesecakes', icon: '🍰' },
  { id: 'Cupcakes', label: 'Cupcakes', icon: '🧁' },
  { id: 'Cookies', label: 'Cookies', icon: '🍪' },
  { id: 'Pastries', label: 'Pastries', icon: '🥐' },
  { id: 'Custom Cakes', label: 'Custom Cakes', icon: '🎁' },
  { id: 'Brownies', label: 'Brownies', icon: '🍫' },
  { id: 'Special Desserts', label: 'Special Desserts', icon: '🍓' },
];

export const MenuPage: React.FC<MenuPageProps> = ({
  products,
  onSelectProduct,
  initialCategory = 'All',
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Popular' | 'Newest' | 'Price: Low to High' | 'Price: High to Low' | 'Highest Rated'>('Popular');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Availability
    if (onlyAvailable) {
      list = list.filter(p => p.isAvailable);
    }

    // Price
    list = list.filter(p => p.price <= maxPrice);

    // Search query
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.flavours.some(f => f.toLowerCase().includes(term))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'Price: Low to High':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'Highest Rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        list.reverse();
        break;
      case 'Popular':
      default:
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return list;
  }, [products, selectedCategory, onlyAvailable, maxPrice, searchQuery, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.isAvailable) {
      showToast(`${product.name} is currently unavailable.`, 'error');
      return;
    }

    const defaultSize = product.sizes?.[0]?.size || 'Standard';
    const defaultPrice = product.sizes?.[0]?.price || product.price;
    const defaultFlavour = product.flavours?.[0] || 'Original';

    addToCart(
      product,
      {
        size: defaultSize,
        flavour: defaultFlavour,
      },
      1,
      defaultPrice
    );

    showToast(`Added ${product.name} (${defaultSize}) to cart! 🍰`, 'success');
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(2000);
    setOnlyAvailable(false);
    setSortBy('Popular');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold tracking-wider text-[#9E5D4E] uppercase">
            Artisanal Patisserie Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#3E2723]">
            Our Bakery Menu
          </h1>
          <p className="text-sm sm:text-base text-[#735D54]">
            Explore our freshly crafted celebration cakes, delicate pastries, stuffed brookies, and cloud cupcakes.
          </p>
        </div>

        {/* Search & Mobile Filter Trigger Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#EBDCCB] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A74]" />
            <input
              type="text"
              placeholder="Search chocolate cakes, croissants, lavender cupcakes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] placeholder-[#A89891] focus:outline-none focus:border-[#9E5D4E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A74] hover:text-[#3E2723]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Sorting Dropdown */}
            <div className="relative inline-block text-left flex-1 md:flex-none">
              <label htmlFor="sort-dropdown-select" className="sr-only">
                Sort bakery treats by
              </label>
              <select
                id="sort-dropdown-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full md:w-auto appearance-none pl-4 pr-9 py-2.5 rounded-full bg-[#FAF7F2] border border-[#EBDCCB] text-xs sm:text-sm font-medium text-[#3E2723] focus:outline-none focus:border-[#9E5D4E] cursor-pointer"
              >
                <option value="Popular">Sort: Popular</option>
                <option value="Newest">Sort: Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Highest Rated">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#8C7A74] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold border border-[#F7D6D0]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Categories Pill Bar (Horizontally scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#9E5D4E] text-white shadow-xs'
                    : 'bg-white hover:bg-[#FCEEEB] text-[#5C453E] border border-[#EBDCCB]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Secondary Row (Desktop: In stock toggle & Price slider) */}
        <div className="hidden md:flex items-center justify-between gap-6 py-3 px-5 mb-8 bg-white/70 rounded-2xl border border-[#EBDCCB]">
          {/* Availability Switch */}
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#4A352F]">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-[#9E5D4E] border-[#EBDCCB] focus:ring-[#9E5D4E]"
            />
            <span>Show Available Treats Only</span>
          </label>

          {/* Price Range Slider */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#4A352F]">
            <span>Max Price: <strong>₹{maxPrice}</strong></span>
            <input
              type="range"
              min="250"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-36 accent-[#9E5D4E] cursor-pointer"
            />
          </div>

          {/* Results count & reset */}
          <div className="flex items-center gap-3 text-xs text-[#8C7A74]">
            <span>Showing {filteredProducts.length} items</span>
            {(selectedCategory !== 'All' || searchQuery || onlyAvailable || maxPrice < 2000) && (
              <button
                onClick={resetFilters}
                className="text-[#9E5D4E] font-semibold underline hover:text-[#783F34]"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white p-5 rounded-3xl border border-[#EBDCCB] mb-8 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-[#3E2723]">Filter Bakes</h4>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-[#8C7A74]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <label className="flex items-center gap-2.5 text-xs font-medium text-[#4A352F]">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={e => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-[#9E5D4E]"
                />
                <span>Available items only</span>
              </label>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#4A352F]">
                  <span>Max Budget</span>
                  <strong>₹{maxPrice}</strong>
                </div>
                <input
                  type="range"
                  min="250"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#9E5D4E]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={resetFilters}
                  className="w-1/2 py-2 text-xs font-medium text-[#8C7A74] bg-[#FAF7F2] rounded-xl"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-[#9E5D4E] rounded-xl"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EBDCCB] p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center mx-auto text-2xl">
              🧁
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3E2723]">
              No treats match your filter
            </h3>
            <p className="text-xs sm:text-sm text-[#735D54]">
              Try adjusting your price range, searching for another keyword, or switching categories.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-[#9E5D4E] text-white text-xs font-semibold hover:bg-[#85473A] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => onSelectProduct(product)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#EBDCCB] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EBE1]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {product.badge && (
                      <span className="px-2 py-0.5 rounded-lg bg-white/95 backdrop-blur-md text-[#9E5D4E] text-[10px] font-bold shadow-xs">
                        {product.badge}
                      </span>
                    )}
                    {!product.isAvailable && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#FFF5F5] text-[#9B2C2C] text-[10px] font-bold border border-[#FED7D7]">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px]">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className="font-serif text-base font-bold text-[#3E2723] group-hover:text-[#9E5D4E] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 bg-[#FEF3E8] px-1.5 py-0.5 rounded-md text-[11px] font-semibold text-[#8C5E28]">
                        <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#735D54] line-clamp-2 leading-relaxed">
                      {product.tagline || product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2.5 border-t border-[#F5EBE1] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#8C7A74] block leading-none">Starting</span>
                      <span className="text-base font-bold text-[#3E2723]">
                        ₹{product.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#4A352F] border border-[#EBDCCB] transition-colors"
                        title="View Options"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        disabled={!product.isAvailable}
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                          product.isAvailable
                            ? 'bg-[#9E5D4E] hover:bg-[#85473A] text-white shadow-xs'
                            : 'bg-[#EBDCCB] text-[#8C7A74] cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{product.isAvailable ? 'Add' : 'Out'}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
