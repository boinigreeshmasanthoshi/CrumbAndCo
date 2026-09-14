import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How much notice is needed for custom celebratory cakes?',
      a: 'We require a minimum of 48 hours for bespoke celebration cakes and 24 hours for our regular signature cakes to ensure proper sponge cooling and precision ganache piping.',
    },
    {
      q: 'Do you offer 100% eggless baked desserts?',
      a: 'Yes! Most of our cakes, brownies, and cupcakes can be prepared 100% eggless without compromising on moisture or luxurious texture. Just select the eggless option or add a note at checkout.',
    },
    {
      q: 'What is your delivery radius and doorstep policy?',
      a: 'We deliver throughout Bengaluru in climate-controlled vehicles to prevent delicate icing melt. Free delivery applies on orders above ₹999.',
    },
    {
      q: 'How long do Crumb & Co. cakes remain fresh?',
      a: 'Our fresh cream and mousse cakes are best enjoyed within 48 hours. Buttercream and chocolate truffle cakes keep beautifully refrigerated for up to 4 days in their airtight boutique box.',
    },
  ];

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast('Message sent! Our kitchen team will reply shortly 💕', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Say Hello to Our Bakers</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#3E2723]">
            Visit Us or Get in Touch
          </h1>

          <p className="text-sm sm:text-base text-[#735D54]">
            Whether you need assistance with an ongoing delivery, want to discuss a corporate dessert table, or simply want to say hello.
          </p>
        </div>

        {/* Contact Information & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCCB] shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#3E2723]">
                Atelier Location & Hours
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FCEEEB] text-[#9E5D4E] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3E2723]">Bakery Atelier</h3>
                    <p className="text-[#6E4F44] leading-relaxed">
                      Crumb & Co. Patisserie<br />
                      142 Rosewood Boulevard, Indiranagar<br />
                      Bengaluru, Karnataka - 560038
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF3E8] text-[#8C5E28] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3E2723]">Baking & Doorstep Hours</h3>
                    <p className="text-[#6E4F44]">
                      Monday – Sunday<br />
                      8:00 AM – 10:00 PM (Ovens warm all day)
                    </p>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#E2ECE0] text-[#3A5536] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3E2723]">Phone & WhatsApp</h3>
                    <p className="text-[#6E4F44]">
                      +91 98201 44521<br />
                      WhatsApp: Instant order support
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5EEFA] text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3E2723]">Email Inquiries</h3>
                    <p className="text-[#6E4F44]">
                      hello@crumbandco.com<br />
                      orders@crumbandco.com
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Chat */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919820144521"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#E2ECE0] hover:bg-[#D4E6D1] text-[#2F4A2B] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#3A5536]" />
                  <span>Chat With Our Cake Concierge on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#EBDCCB] shadow-xs relative">
              <div className="h-44 bg-[#EBDCCB] relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Indiranagar Map preview"
                  className="w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="font-bold text-xs">Indiranagar Boutique & Cafe</p>
                    <p className="text-[10px] text-white/80">Open for dine-in pastries & pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCCB] shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#3E2723]">
                Send Us a Message
              </h2>
              <p className="text-xs text-[#735D54] mt-1">
                Have an inquiry about wedding catering or bulk corporate gifting? We usually reply within 2 hours.
              </p>
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Maya Roy"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#4A352F]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A352F]">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Wedding Dessert Table Inquiry"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4A352F]">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Share details of your celebration, guest count, or questions..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBDCCB] shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#3E2723]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#735D54]">
              Quick answers about freshness, ordering windows, and bespoke baking.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#EBDCCB] rounded-2xl overflow-hidden transition-all bg-[#FAF7F2]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <h3 className="font-serif font-bold text-sm text-[#3E2723]">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C7A74] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#9E5D4E]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 pt-1 text-xs text-[#6E4F44] leading-relaxed border-t border-[#EBDCCB]/50"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
