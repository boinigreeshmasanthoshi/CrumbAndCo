import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Clock, MapPin, Phone, Package, Truck, Home, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../../types.js';

interface OrderConfirmationProps {
  order: Order;
  onReturnHome: () => void;
  onViewMenu: () => void;
}

const TRACKING_STEPS: { status: OrderStatus; label: string; icon: string; description: string }[] = [
  { status: 'Pending', label: 'Order Placed', icon: '📝', description: 'Order received by atelier' },
  { status: 'Confirmed', label: 'Confirmed', icon: '✅', description: 'Ingredients measured & prepped' },
  { status: 'Preparing', label: 'In The Oven', icon: '🧁', description: 'Freshly baking & hand-piping' },
  { status: 'Out for Delivery', label: 'Out for Delivery', icon: '🚚', description: 'Handed to temperature-safe courier' },
  { status: 'Delivered', label: 'Delivered', icon: '🎉', description: 'Arrived at your doorstep' },
];

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order: initialOrder,
  onReturnHome,
  onViewMenu,
}) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F7D6D0', '#FED7AA', '#E2ECE0', '#9E5D4E', '#F5EEFA'],
      });
    } catch {
      // ignore
    }
  }, []);

  const refreshOrderStatus = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`);
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
      }
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    const idx = TRACKING_STEPS.findIndex(s => s.status === status);
    return idx === -1 ? 1 : idx;
  };

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBDCCB] shadow-lg space-y-8 text-center"
        >
          {/* Header icon & prompt quote */}
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FCEEEB] to-[#FED7AA] flex items-center justify-center mx-auto shadow-sm border border-[#F7D6D0]">
              <span className="text-4xl select-none">🧁</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2ECE0] text-[#3A5536] text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5B7B56]" />
              <span>Order Successfully Placed</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3E2723]">
              Your order is officially baking! 🧁💕
            </h1>

            <p className="text-xs sm:text-sm text-[#735D54] max-w-md mx-auto">
              Thank you, <strong>{order.customer.fullName}</strong>. Our head patissier has received your order and is measuring out organic French butter and Belgian chocolate.
            </p>

            <div className="pt-2">
              <span className="text-xs text-[#8C7A74]">Order Reference ID:</span>
              <div className="font-mono text-lg font-bold text-[#9E5D4E] bg-[#FAF7F2] inline-block px-4 py-1.5 rounded-xl border border-[#EBDCCB] mt-1">
                {order.id}
              </div>
            </div>
          </div>

          {/* Tracking Pipeline Status */}
          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#EBDCCB] space-y-4 text-left">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-serif font-bold text-base text-[#3E2723] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#9E5D4E]" />
                <span>Live Order Progress</span>
              </h3>

              <button
                onClick={refreshOrderStatus}
                disabled={isRefreshing}
                className="text-xs text-[#9E5D4E] font-semibold flex items-center gap-1.5 hover:underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Track My Order</span>
              </button>
            </div>

            {/* Stepper horizontal */}
            <div className="relative pt-4 pb-2">
              <div className="grid grid-cols-5 gap-2 relative">
                {TRACKING_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="flex flex-col items-center text-center space-y-2 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all shadow-xs ${
                          isCurrent
                            ? 'bg-[#9E5D4E] text-white ring-4 ring-[#FCEEEB] scale-110'
                            : isDone
                            ? 'bg-[#E2ECE0] text-[#3A5536] border border-[#C8DEC3]'
                            : 'bg-white text-[#A89891] border border-[#EBDCCB]'
                        }`}
                      >
                        {step.icon}
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-[11px] font-bold ${
                            isCurrent
                              ? 'text-[#9E5D4E]'
                              : isDone
                              ? 'text-[#3E2723]'
                              : 'text-[#A89891]'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[9px] text-[#8C7A74] hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          <div className="text-left border-t border-[#FAF7F2] pt-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#3E2723]">
              Ordered Delicacies
            </h3>

            <div className="space-y-3">
              {order.items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EBDCCB]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#3E2723]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#735D54]">
                        {item.customization.size} • {item.customization.flavour}
                      </p>
                      {item.customization.customMessage && (
                        <p className="text-[11px] text-[#9E5D4E] italic">
                          “{item.customization.customMessage}”
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#8C7A74]">Qty: {item.quantity}</p>
                    <p className="font-bold text-sm text-[#3E2723]">
                      ₹{item.unitPrice * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs">
            {/* Delivery address */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBDCCB] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#3E2723]">
                <MapPin className="w-4 h-4 text-[#9E5D4E]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-[#5C453E]">
                {order.address.houseFlat}, {order.address.street}, {order.address.area}
              </p>
              <p className="text-[#5C453E]">
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="text-[#8C7A74] pt-1">
                Contact: {order.customer.phone}
              </p>
            </div>

            {/* Timing & Payment */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBDCCB] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#3E2723]">
                <Clock className="w-4 h-4 text-[#9E5D4E]" />
                <span>Scheduled Slot & Payment</span>
              </div>
              <p className="text-[#5C453E]">
                Date: <strong>{order.deliveryDate}</strong>
              </p>
              <p className="text-[#5C453E]">
                Slot: <strong>{order.deliveryTimeSlot}</strong>
              </p>
              <p className="text-[#5C453E] pt-1">
                Payment: <strong>{order.paymentMethod}</strong> (Total: <strong>₹{order.total}</strong>)
              </p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onReturnHome}
              className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#3E2723] font-semibold text-xs border border-[#EBDCCB] shadow-xs flex items-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <button
              onClick={onViewMenu}
              className="px-6 py-3 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-semibold text-xs shadow-md flex items-center gap-2 transition-colors"
            >
              <span>Explore More Treats</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
};
