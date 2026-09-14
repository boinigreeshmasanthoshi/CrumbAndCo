import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Package,
  Wand2,
  MessageSquare,
  RefreshCw,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { Product, Order, OrderStatus, CustomCakeRequest, Review, ProductCategory } from '../../types.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface AdminDashboardProps {
  onClose: () => void;
}

const CATEGORY_LIST: ProductCategory[] = [
  'Birthday Cakes',
  'Cheesecakes',
  'Cupcakes',
  'Cookies',
  'Pastries',
  'Custom Cakes',
  'Brownies',
  'Special Desserts',
];

const COLORS = ['#9E5D4E', '#E8976C', '#9FB89A', '#B594B6', '#D4AF37', '#6E4F44', '#E09F9F', '#7EA8A0'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'custom-cakes' | 'reviews'>('analytics');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomCakeRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for product
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState<ProductCategory>('Birthday Cakes');
  const [pPrice, setPPrice] = useState(850);
  const [pImage, setPImage] = useState('');
  const [pTagline, setPTagline] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pBadge, setPBadge] = useState('Bestseller');
  const [pAvailable, setPAvailable] = useState(true);
  const [pFeatured, setPFeatured] = useState(true);
  const [pFlavours, setPFlavours] = useState('Belgian Dark Chocolate, Dutch Truffle, Vanilla');
  const [pIngredients, setPIngredients] = useState('Callebaut chocolate, Normandy butter, organic vanilla');
  const [pAllergens, setPAllergens] = useState('Contains Dairy, Gluten');

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  const loadAllAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // 2. Orders
      const ordersRes = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ordersRes.ok) setOrders(await ordersRes.json());

      // 3. Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) setProducts(await prodRes.json());

      // 4. Custom Cakes
      const customRes = await fetch('/api/custom-cakes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (customRes.ok) setCustomRequests(await customRes.json());

      // 5. Reviews
      const revRes = await fetch('/api/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (revRes.ok) setReviews(await revRes.json());
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  // Status Updater for Orders
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
        showToast(`Order status updated to ${status}! 🧁`, 'success');
      }
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  // Status Updater for Custom Cake requests
  const handleUpdateCustomCakeStatus = async (requestId: string, status: CustomCakeRequest['status']) => {
    try {
      const res = await fetch(`/api/custom-cakes/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setCustomRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status } : r)));
        showToast(`Inquiry status set to ${status}`, 'success');
      }
    } catch {
      showToast('Failed to update request status', 'error');
    }
  };

  // Toggle Stock Availability
  const handleToggleProductStock = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });
      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p))
        );
        showToast(
          `${product.name} is now ${!product.isAvailable ? 'In Stock ✅' : 'Out of Stock ❌'}`,
          'info'
        );
      }
    } catch {
      showToast('Failed to toggle stock', 'error');
    }
  };

  // Open Edit Product
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPCategory(product.category);
    setPPrice(product.price);
    setPImage(product.image);
    setPTagline(product.tagline || '');
    setPDesc(product.description);
    setPBadge(product.badge || '');
    setPAvailable(product.isAvailable);
    setPFeatured(product.isFeatured);
    setPFlavours(product.flavours.join(', '));
    setPIngredients(product.ingredients.join(', '));
    setPAllergens(product.allergens.join(', '));
    setIsProductModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory('Birthday Cakes');
    setPPrice(850);
    setPImage('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80');
    setPTagline('Handcrafted small batch');
    setPDesc('Slow-baked sponge layered with luscious Belgian ganache and silky cream.');
    setPBadge('New Bake');
    setPAvailable(true);
    setPFeatured(false);
    setPFlavours('Belgian Chocolate, Vanilla Bean');
    setPIngredients('Callebaut chocolate, fresh cream, butter, flour');
    setPAllergens('Dairy, Gluten');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: pName,
      category: pCategory,
      price: Number(pPrice),
      image: pImage,
      tagline: pTagline,
      description: pDesc,
      badge: pBadge,
      isAvailable: pAvailable,
      isFeatured: pFeatured,
      flavours: pFlavours.split(',').map(s => s.trim()).filter(Boolean),
      ingredients: pIngredients.split(',').map(s => s.trim()).filter(Boolean),
      allergens: pAllergens.split(',').map(s => s.trim()).filter(Boolean),
      sizes: [
        { size: '0.5 kg', price: Number(pPrice) },
        { size: '1 kg', price: Math.round(Number(pPrice) * 1.85) },
        { size: '1.5 kg', price: Math.round(Number(pPrice) * 2.7) },
        { size: '2 kg', price: Math.round(Number(pPrice) * 3.5) },
      ],
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
          showToast('Product updated successfully! 🍰', 'success');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setProducts(prev => [created, ...prev]);
          showToast('New bakery treat published! ✨', 'success');
        }
      }
      setIsProductModalOpen(false);
    } catch {
      showToast('Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this treat from the catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product removed.', 'info');
      }
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  // Review approval/deletion
  const handleApproveReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => (r.id === id ? { ...r, isApproved: true } : r)));
        showToast('Review approved & published on website!', 'success');
      }
    } catch {
      showToast('Failed to approve review', 'error');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        showToast('Review removed.', 'info');
      }
    } catch {
      showToast('Failed to delete review', 'error');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch =
      orderSearch === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Chart data formatting
  const categoryChartData = Object.entries(stats?.categoryBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const salesTrendData = [
    { day: 'Mon', revenue: 3800 },
    { day: 'Tue', revenue: 4200 },
    { day: 'Wed', revenue: 3100 },
    { day: 'Thu', revenue: 5400 },
    { day: 'Fri', revenue: 7800 },
    { day: 'Sat', revenue: 11200 },
    { day: 'Sun', revenue: 9800 },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#EBDCCB] shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3E2723] text-white flex items-center justify-center text-xl shadow-xs">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#3E2723]">
                  Crumb & Co. Head Patissier Dashboard
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E2ECE0] text-[#3A5536] text-[10px] font-bold">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#8C7A74]">
                Manage orders, oven pipeline, treats catalogue, and bespoke custom cake inquiries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={loadAllAdminData}
              className="p-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#3E2723] border border-[#EBDCCB] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Back to Storefront
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-[#EBDCCB] mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Pipeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'products'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products & Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom-cakes')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'custom-cakes'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Custom Cakes ({customRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews Moderation ({reviews.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Stat metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8C7A74]">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <div className="w-8 h-8 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center">
                    ₹
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-[#3E2723]">
                  ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '14,200'}
                </div>
                <p className="text-[11px] text-[#5B7B56] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% from last week</span>
                </p>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8C7A74]">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <div className="w-8 h-8 rounded-full bg-[#FEF3E8] text-[#8C5E28] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-[#3E2723]">
                  {stats?.totalOrders || orders.length}
                </div>
                <p className="text-[11px] text-[#735D54]">
                  Active in baking pipeline: {orders.filter(o => o.status !== 'Delivered').length}
                </p>
              </div>

              {/* Customers */}
              <div className="bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8C7A74]">
                  <span className="text-xs font-bold uppercase tracking-wider">Registered Celebrators</span>
                  <div className="w-8 h-8 rounded-full bg-[#EEF4ED] text-[#3A5536] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-[#3E2723]">
                  {stats?.totalCustomers || 48}
                </div>
                <p className="text-[11px] text-[#5B7B56] font-semibold">
                  ⭐ 4.9 Average Customer Rating
                </p>
              </div>

              {/* Top Selling Treat */}
              <div className="bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8C7A74]">
                  <span className="text-xs font-bold uppercase tracking-wider">Top Selling Bake</span>
                  <div className="w-8 h-8 rounded-full bg-[#F5EEFA] text-[#7C3AED] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-base font-bold font-serif text-[#3E2723] truncate">
                  {stats?.topSellingProduct || 'Chef’s Belgian Truffle'}
                </div>
                <p className="text-[11px] text-[#735D54]">
                  Responsible for 34% of weekly volume
                </p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sales Weekly Trend */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                  Weekly Baking Sales Trend (₹)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F5EBE1" />
                      <XAxis dataKey="day" stroke="#8C7A74" fontSize={12} />
                      <YAxis stroke="#8C7A74" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FAF7F2',
                          borderColor: '#EBDCCB',
                          borderRadius: '12px',
                        }}
                      />
                      <Bar dataKey="revenue" fill="#9E5D4E" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Pie */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EBDCCB] shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                  Category Sales Distribution
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData.length > 0 ? categoryChartData : [{ name: 'Cakes', value: 40 }, { name: 'Pastries', value: 25 }, { name: 'Cookies', value: 20 }, { name: 'Desserts', value: 15 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {(categoryChartData.length > 0 ? categoryChartData : [1, 2, 3, 4]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FAF7F2',
                          borderColor: '#EBDCCB',
                          borderRadius: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center text-[10px] text-[#735D54]">
                  {categoryChartData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS PIPELINE */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-[#EBDCCB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-[#8C7A74] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, name, or phone..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#735D54]">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing (In Oven)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-[#EBDCCB] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#4A352F] border-b border-[#EBDCCB]">
                    <tr>
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Customer & Contact</th>
                      <th className="p-4 font-bold">Treats & Customization</th>
                      <th className="p-4 font-bold">Delivery Slot</th>
                      <th className="p-4 font-bold">Total</th>
                      <th className="p-4 font-bold">Current Pipeline Status</th>
                      <th className="p-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF7F2]">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="p-4 font-mono font-bold text-[#9E5D4E]">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-[#3E2723]">{order.customer.fullName}</p>
                          <p className="text-[#8C7A74]">{order.customer.phone}</p>
                          <p className="text-[10px] text-[#A89891]">{order.address.area}, {order.address.city}</p>
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="space-y-1">
                            {order.items.map(it => (
                              <div key={it.id} className="truncate">
                                <strong>{it.quantity}x</strong> {it.name} ({it.customization.size})
                                {it.customization.customMessage && (
                                  <span className="text-[10px] text-[#9E5D4E] italic block truncate">
                                    “{it.customization.customMessage}”
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-[#3E2723]">{order.deliveryDate}</p>
                          <p className="text-[11px] text-[#8C7A74]">{order.deliveryTimeSlot}</p>
                        </td>
                        <td className="p-4 font-bold text-[#3E2723]">
                          ₹{order.total}
                          <span className="text-[10px] text-[#8C7A74] block font-normal">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              order.status === 'Delivered'
                                ? 'bg-[#E2ECE0] text-[#3A5536]'
                                : order.status === 'Preparing'
                                ? 'bg-[#FEF3E8] text-[#8C5E28]'
                                : 'bg-[#FCEEEB] text-[#9E5D4E]'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EBDCCB] text-[11px] font-semibold text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & STOCK MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3E2723]">
                  Bakery Catalog & Inventory
                </h2>
                <p className="text-xs text-[#735D54]">
                  Add seasonal specials, update prices, or toggle daily kitchen availability.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Treat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-5 border border-[#EBDCCB] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-[#F5EBE1] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#9E5D4E] font-bold uppercase">
                          {product.category}
                        </span>
                        <span className="text-xs font-bold text-[#3E2723]">
                          ₹{product.price}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-[#3E2723] truncate">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#735D54] line-clamp-2 mt-1">
                        {product.tagline || product.description}
                      </p>
                    </div>
                  </div>

                  {/* Stock Toggle & Controls */}
                  <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleProductStock(product)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                        product.isAvailable
                          ? 'bg-[#E2ECE0] text-[#3A5536]'
                          : 'bg-[#FFF5F5] text-[#9B2C2C]'
                      }`}
                    >
                      {product.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{product.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#4A352F] hover:bg-[#F5EBE1] transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#9B2C2C] hover:bg-[#FFF5F5] transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM CAKES REQUESTS */}
        {activeTab === 'custom-cakes' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3E2723]">
                Bespoke Custom Cake Inquiries
              </h2>
              <p className="text-xs text-[#735D54]">
                Review customer themes, weights, reference photos, and update inquiry quotation statuses.
              </p>
            </div>

            <div className="space-y-4">
              {customRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-[#EBDCCB] shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FAF7F2]">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#3E2723]">
                        {req.cakeType} ({req.cakeSize})
                      </h3>
                      <p className="text-xs text-[#735D54]">
                        From: <strong>{req.name}</strong> • {req.phone} • {req.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#8C7A74]">Status:</span>
                      <select
                        value={req.status}
                        onChange={e => handleUpdateCustomCakeStatus(req.id, e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs font-semibold text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      >
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1 bg-[#FAF7F2] p-3 rounded-2xl">
                      <span className="text-[10px] text-[#8C7A74] block uppercase font-bold">Flavour & Theme</span>
                      <p className="font-semibold text-[#3E2723]">{req.flavour}</p>
                      <p className="text-[#6E4F44]">Theme: {req.theme || 'Open to artist suggestion'}</p>
                    </div>

                    <div className="space-y-1 bg-[#FAF7F2] p-3 rounded-2xl">
                      <span className="text-[10px] text-[#8C7A74] block uppercase font-bold">Date & Custom Lettering</span>
                      <p className="font-semibold text-[#3E2723]">{req.preferredDate} ({req.preferredTime})</p>
                      <p className="text-[#9E5D4E] italic">“{req.customMessage || 'No message requested'}”</p>
                    </div>

                    <div className="space-y-1 bg-[#FAF7F2] p-3 rounded-2xl">
                      <span className="text-[10px] text-[#8C7A74] block uppercase font-bold">Special Dietary Requests</span>
                      <p className="text-[#6E4F44]">{req.specialRequirements || 'Standard batch'}</p>
                    </div>
                  </div>

                  {/* Reference Image preview */}
                  {req.referenceImage && (
                    <div className="pt-2 flex items-center gap-3">
                      <img
                        src={req.referenceImage}
                        alt="Custom cake reference"
                        className="w-20 h-20 rounded-2xl object-cover border border-[#EBDCCB] shadow-xs"
                      />
                      <span className="text-xs text-[#8C7A74]">Customer reference inspiration photo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3E2723]">
                Customer Reviews Moderation
              </h2>
              <p className="text-xs text-[#735D54]">
                Approve or moderate user-submitted reviews before they appear on the homepage carousel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(rev => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-5 border border-[#EBDCCB] shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#F59E0B]">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                          rev.isApproved
                            ? 'bg-[#E2ECE0] text-[#3A5536]'
                            : 'bg-[#FEF3E8] text-[#8C5E28]'
                        }`}
                      >
                        {rev.isApproved ? 'Approved & Live' : 'Pending Approval'}
                      </span>
                    </div>

                    <p className="font-serif italic text-sm text-[#3E2723]">
                      “{rev.comment}”
                    </p>

                    <p className="text-xs text-[#8C7A74]">
                      — <strong>{rev.customerName}</strong> for <em>{rev.productName}</em>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-end gap-2">
                    {!rev.isApproved && (
                      <button
                        onClick={() => handleApproveReview(rev.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#E2ECE0] hover:bg-[#D4E6D1] text-[#3A5536] text-xs font-bold transition-colors"
                      >
                        Approve & Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF5F5] hover:bg-[#FED7D7] text-[#9B2C2C] text-xs font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#EBDCCB] p-6 sm:p-8 relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-[#8C7A74] hover:text-[#3E2723]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-[#3E2723] mb-4">
              {editingProduct ? 'Edit Bakery Treat' : 'Create New Bakery Treat'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Treat Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={e => setPName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Category *</label>
                  <select
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  >
                    {CATEGORY_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Starting Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={e => setPPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Badge (e.g. Bestseller, Seasonal)</label>
                  <input
                    type="text"
                    value={pBadge}
                    onChange={e => setPBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">Image URL (Unsplash or direct asset)</label>
                  <input
                    type="url"
                    required
                    value={pImage}
                    onChange={e => setPImage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">Short Catchy Tagline</label>
                  <input
                    type="text"
                    value={pTagline}
                    onChange={e => setPTagline(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">Full Description</label>
                  <textarea
                    rows={2}
                    value={pDesc}
                    onChange={e => setPDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] resize-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">Available Flavours (comma-separated)</label>
                  <input
                    type="text"
                    value={pFlavours}
                    onChange={e => setPFlavours(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">Key Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    value={pIngredients}
                    onChange={e => setPIngredients(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723]"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#4A352F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pAvailable}
                      onChange={e => setPAvailable(e.target.checked)}
                      className="rounded text-[#9E5D4E]"
                    />
                    <span>Available In Kitchen Today</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#4A352F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pFeatured}
                      onChange={e => setPFeatured(e.target.checked)}
                      className="rounded text-[#9E5D4E]"
                    />
                    <span>Feature on Homepage (“Fresh From Our Oven”)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-white text-xs font-semibold text-[#735D54] border border-[#EBDCCB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white text-xs font-bold shadow-xs"
                >
                  Save Delicacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
