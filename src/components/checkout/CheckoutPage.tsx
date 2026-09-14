import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, Clock, CreditCard, Banknote, QrCode, CheckCircle2, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { PaymentMethod, Order } from '../../types.js';

interface CheckoutPageProps {
  onOrderPlaced: (order: Order) => void;
  onBackToMenu: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderPlaced,
  onBackToMenu,
}) => {
  const { items, subtotal, deliveryFee, discount, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  const [houseFlat, setHouseFlat] = useState(user?.savedAddress?.houseFlat || '');
  const [street, setStreet] = useState(user?.savedAddress?.street || '');
  const [area, setArea] = useState(user?.savedAddress?.area || '');
  const [city, setCity] = useState(user?.savedAddress?.city || 'Bengaluru');
  const [state, setState] = useState(user?.savedAddress?.state || 'Karnataka');
  const [pincode, setPincode] = useState(user?.savedAddress?.pincode || '560038');

  // Tomorrow's date as standard default
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [deliveryDate, setDeliveryDate] = useState(tomorrow);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('14:00 - 17:00 (Afternoon)');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when user logs in or updates
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
      if (user.savedAddress) {
        if (!houseFlat) setHouseFlat(user.savedAddress.houseFlat || '');
        if (!street) setStreet(user.savedAddress.street || '');
        if (!area) setArea(user.savedAddress.area || '');
        if (!city) setCity(user.savedAddress.city || 'Bengaluru');
        if (!state) setState(user.savedAddress.state || 'Karnataka');
        if (!pincode) setPincode(user.savedAddress.pincode || '560038');
      }
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#FCEEEB] flex items-center justify-center mx-auto text-3xl">
          🧁
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#3E2723]">
          Your bag is empty
        </h2>
        <p className="text-sm text-[#735D54]">
          Please select your favorite fresh bakery treats before heading to checkout.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 rounded-full bg-[#9E5D4E] text-white font-semibold text-xs hover:bg-[#85473A] transition-colors"
        >
          Browse Bakery Menu
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      showToast('Please provide your complete customer contact details.', 'error');
      return;
    }
    if (!houseFlat.trim() || !street.trim() || !area.trim() || !city.trim() || !pincode.trim()) {
      showToast('Please provide your full delivery address and pincode.', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: { fullName, phone, email },
      address: { houseFlat, street, area, city, state, pincode },
      items,
      deliveryDate,
      deliveryTimeSlot,
      specialInstructions,
      paymentMethod,
    };

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      showToast('Order received! Our ovens are heating up 💕', 'success');
      onOrderPlaced(data);
    } catch (err: any) {
      showToast(err.message || 'Something went wrong. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link & Header */}
        <div className="mb-8">
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7A74] hover:text-[#3E2723] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3E2723]">
            Checkout & Handcrafted Delivery
          </h1>
          <p className="text-xs sm:text-sm text-[#735D54] mt-1">
            Fill in your doorstep delivery details for scheduled arrival.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form Sections (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Section 1: Customer Info */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDCCB] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF7F2]">
                  <span className="w-6 h-6 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                    Customer Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4A352F]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rhea Kapoor"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98201 44521"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rhea.kapoor@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDCCB] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF7F2]">
                  <span className="w-6 h-6 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                    Delivery Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">House / Flat / Villa No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apt 402, Lotus Orchid"
                      value={houseFlat}
                      onChange={e => setHouseFlat(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">Street / Road Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12th Main Road"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">Area / Locality *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indiranagar 1st Stage"
                      value={area}
                      onChange={e => setArea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F]">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 560038"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Schedule & Special Instructions */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDCCB] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF7F2]">
                  <span className="w-6 h-6 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                    Delivery Slot & Order Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#9E5D4E]" />
                      <span>Preferred Delivery Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={deliveryDate}
                      onChange={e => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#4A352F] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#9E5D4E]" />
                      <span>Preferred Time Slot *</span>
                    </label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={e => setDeliveryTimeSlot(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-sm text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    >
                      <option value="10:00 - 13:00 (Morning)">10:00 AM – 1:00 PM (Morning Slot)</option>
                      <option value="14:00 - 17:00 (Afternoon)">2:00 PM – 5:00 PM (Afternoon Slot)</option>
                      <option value="18:00 - 21:00 (Evening)">6:00 PM – 9:00 PM (Evening Celebration Slot)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-[#4A352F]">
                      Special Instructions (Gate code, candle count, call upon arrival, etc.)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Ring the doorbell twice, please handle the delicate cake box with care."
                      value={specialInstructions}
                      onChange={e => setSpecialInstructions(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] placeholder-[#A89891] focus:outline-none focus:border-[#9E5D4E] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Payment */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBDCCB] shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#FAF7F2]">
                  <span className="w-6 h-6 rounded-full bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                    Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* UPI */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between space-y-3 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-[#FCEEEB] border-[#9E5D4E] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EBDCCB] hover:border-[#9E5D4E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-[#9E5D4E]" />
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="text-[#9E5D4E] focus:ring-[#9E5D4E]"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3E2723]">UPI Instant</p>
                      <p className="text-[11px] text-[#735D54]">GPay / PhonePe / Paytm</p>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between space-y-3 transition-all ${
                      paymentMethod === 'Online Payment'
                        ? 'bg-[#FCEEEB] border-[#9E5D4E] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EBDCCB] hover:border-[#9E5D4E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-[#9E5D4E]" />
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Online Payment'}
                        onChange={() => setPaymentMethod('Online Payment')}
                        className="text-[#9E5D4E] focus:ring-[#9E5D4E]"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3E2723]">Cards / NetBanking</p>
                      <p className="text-[11px] text-[#735D54]">Visa, Mastercard, RuPay</p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between space-y-3 transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'bg-[#FCEEEB] border-[#9E5D4E] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#EBDCCB] hover:border-[#9E5D4E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Banknote className="w-5 h-5 text-[#9E5D4E]" />
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                        className="text-[#9E5D4E] focus:ring-[#9E5D4E]"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3E2723]">Cash on Delivery</p>
                      <p className="text-[11px] text-[#735D54]">Pay upon doorstep arrival</p>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBDCCB] space-y-2 mt-2">
                    <label className="text-xs font-semibold text-[#4A352F] block">
                      Enter UPI VPA ID (Optional for fast verification)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@okhdfcbank"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                    />
                    <p className="text-[11px] text-[#8C7A74]">
                      A UPI payment notification will also be sent to your phone upon order placement.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#EBDCCB] shadow-sm space-y-5">
                <h3 className="font-serif text-lg font-bold text-[#3E2723] pb-3 border-b border-[#FAF7F2]">
                  Order Summary
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#F5EBE1]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#3E2723] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#8C7A74]">
                          {item.quantity}x • {item.customization.size}
                        </p>
                      </div>
                      <span className="font-bold text-[#3E2723]">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="pt-3 border-t border-[#FAF7F2] space-y-2 text-xs text-[#735D54]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#3E2723]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[#3E2723]">
                      {deliveryFee === 0 ? <span className="text-[#5B7B56]">FREE</span> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#5B7B56]">
                      <span>Celebration Discount</span>
                      <span className="font-semibold">-₹{discount}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#EBDCCB] flex justify-between text-base font-bold text-[#3E2723]">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  id="checkout-place-order-btn"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Baking Your Order...' : `Place Order • ₹${total}`}</span>
                </button>

                <div className="text-center">
                  <p className="text-[11px] text-[#8C7A74] flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5B7B56]" />
                    <span>256-bit encrypted secure checkout</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
