import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Package, MapPin, Clock, LogOut, ShieldCheck, ChevronRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { Order } from '../../types.js';

interface AccountPageProps {
  onSelectOrderForTracking: (order: Order) => void;
  onOpenAdminDashboard: () => void;
  onBrowseMenu: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onSelectOrderForTracking,
  onOpenAdminDashboard,
  onBrowseMenu,
}) => {
  const { user, token, logout, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Profile edit states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [houseFlat, setHouseFlat] = useState(user?.savedAddress?.houseFlat || '');
  const [street, setStreet] = useState(user?.savedAddress?.street || '');
  const [area, setArea] = useState(user?.savedAddress?.area || '');
  const [city, setCity] = useState(user?.savedAddress?.city || '');
  const [state, setState] = useState(user?.savedAddress?.state || '');
  const [pincode, setPincode] = useState(user?.savedAddress?.pincode || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token]);

  const fetchUserOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        phone,
        savedAddress: {
          houseFlat,
          street,
          area,
          city,
          state,
          pincode,
        },
      });
      showToast('Profile & delivery address updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FCEEEB] flex items-center justify-center mx-auto text-2xl">
          🔒
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#3E2723]">Account Access</h2>
        <p className="text-xs text-[#735D54]">
          Please sign in to view your past orders, delivery tracking, and saved addresses.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with user greeting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCCB] shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FCEEEB] text-[#9E5D4E] font-serif font-bold text-2xl flex items-center justify-center border border-[#F7D6D0] shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-[#3E2723]">{user.name}</h1>
                {user.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3E8] border border-[#FED7AA] text-[#8C5E28] text-[10px] font-bold">
                    Admin / Head Patissier
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8C7A74] mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {user.role === 'admin' && (
              <button
                onClick={onOpenAdminDashboard}
                className="px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                Open Admin Dashboard
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#9E5D4E] text-xs font-semibold border border-[#EBDCCB] flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-[#EBDCCB] mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'profile'
                ? 'bg-[#9E5D4E] text-white shadow-xs'
                : 'text-[#735D54] hover:text-[#3E2723]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Address</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#3E2723]">
                Past & Active Bakery Orders
              </h2>
              <button
                onClick={fetchUserOrders}
                className="text-xs text-[#9E5D4E] font-semibold flex items-center gap-1 hover:underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EBDCCB] p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FCEEEB] flex items-center justify-center mx-auto text-2xl">
                  🎂
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                  No orders placed yet
                </h3>
                <p className="text-xs text-[#735D54]">
                  Treat yourself or send a warm surprise cake to someone special today.
                </p>
                <button
                  onClick={onBrowseMenu}
                  className="px-5 py-2.5 rounded-full bg-[#9E5D4E] text-white text-xs font-semibold hover:bg-[#85473A] transition-colors"
                >
                  Explore Bakery Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-[#EBDCCB] shadow-xs hover:shadow-sm transition-all space-y-4"
                  >
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#FAF7F2]">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#9E5D4E]">
                          {order.id}
                        </span>
                        <p className="text-[11px] text-[#8C7A74]">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FCEEEB] text-[#9E5D4E] border border-[#F7D6D0]">
                          {order.status}
                        </span>

                        <button
                          onClick={() => onSelectOrderForTracking(order)}
                          className="px-3 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#3E2723] text-xs font-semibold border border-[#EBDCCB] flex items-center gap-1 transition-colors"
                        >
                          <span>Live Track</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2.5 text-xs bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EBDCCB]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#3E2723] truncate">{item.name}</p>
                            <p className="text-[10px] text-[#8C7A74]">
                              {item.quantity}x • {item.customization.size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order footer meta */}
                    <div className="pt-2 flex items-center justify-between text-xs text-[#735D54]">
                      <div>
                        <span>Scheduled: <strong>{order.deliveryDate}</strong> ({order.deliveryTimeSlot})</span>
                      </div>
                      <div>
                        <span>Total Paid: <strong className="text-sm text-[#3E2723]">₹{order.total}</strong> ({order.paymentMethod})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Saved Addresses */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCCB] shadow-xs max-w-2xl">
            <h2 className="font-serif text-xl font-bold text-[#3E2723] mb-4">
              Saved Contact & Doorstep Delivery Address
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">House / Flat / Villa No.</label>
                  <input
                    type="text"
                    value={houseFlat}
                    onChange={e => setHouseFlat(e.target.value)}
                    placeholder="e.g. 402, Lotus Tower"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#4A352F]">Street & Area</label>
                  <input
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="e.g. 12th Main Road, Indiranagar"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Update Profile & Address'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
