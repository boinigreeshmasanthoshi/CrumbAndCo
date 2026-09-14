import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wand2, Upload, Calendar, Clock, CheckCircle2, Sparkles, Image as ImageIcon, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';
import { useAuth } from '../../context/AuthContext.js';

export const CustomCakePage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [cakeType, setCakeType] = useState('2-Tier Vintage Lambeth Cake');
  const [cakeSize, setCakeSize] = useState('1.5 kg');
  const [flavour, setFlavour] = useState('Belgian Dark Chocolate');
  
  const minDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]; // minimum 2 days notice for custom cakes
  const [preferredDate, setPreferredDate] = useState(minDate);
  const [preferredTime, setPreferredTime] = useState('15:00');
  const [theme, setTheme] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [referenceImage, setReferenceImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sampleCakeTypes = [
    '2-Tier Vintage Lambeth Cake',
    'Pastel Watercolour Palette Cake',
    'Semi-Naked Berry & Floral Cake',
    'Minimalist Korean Bento Aesthetic Cake',
    'Sculpted Themed 3D Cake',
    'Golden Leaf & Geode Cake',
  ];

  const sampleFlavours = [
    'Belgian Dark Chocolate',
    'Raspberry Champagne & Vanilla',
    'Sicilian Pistachio & White Chocolate',
    'Classic Red Velvet Cream Cheese',
    'Salted Butterscotch Pecan',
    'Espresso Mocha Noir',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be under 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        showToast('Reference image attached!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !cakeType || !preferredDate) {
      showToast('Please fill in the required custom inquiry fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/custom-cakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          cakeType,
          cakeSize,
          flavour,
          preferredDate,
          preferredTime,
          theme,
          customMessage,
          specialRequirements,
          referenceImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setSubmitted(true);
      showToast('Your custom cake request was sent to our atelier! 🎂', 'success');
    } catch (err: any) {
      showToast(err.message || 'Submission failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FCEEEB] text-[#9E5D4E] text-xs font-semibold">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Bespoke Celebration Studio</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#3E2723]">
            Custom Dream Cakes
          </h1>

          <p className="text-sm sm:text-base text-[#735D54]">
            Have a unique theme, multi-tiered wedding fantasy, or vintage Lambeth piping in mind? Share your inspiration and our head chef will handcraft it to life.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-white rounded-3xl p-10 border border-[#EBDCCB] shadow-md text-center space-y-5"
          >
            <div className="w-20 h-20 rounded-full bg-[#E2ECE0] text-[#3A5536] flex items-center justify-center mx-auto text-3xl">
              🎂
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#3E2723]">
              Request Received with Joy!
            </h2>
            <p className="text-sm text-[#735D54]">
              Thank you, <strong>{name}</strong>! Our head pastry designer is reviewing your theme specifications and will message you a sketch and price quotation on WhatsApp/phone within 2–4 business hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#3E2723] text-xs font-semibold border border-[#EBDCCB]"
            >
              Submit Another Inquiry
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCCB] shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact row */}
                <div className="space-y-3">
                  <h3 className="font-serif text-base font-bold text-[#3E2723]">
                    1. Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Sneha Patel"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="sneha@example.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>
                  </div>
                </div>

                {/* Cake Configuration */}
                <div className="space-y-3 pt-3 border-t border-[#FAF7F2]">
                  <h3 className="font-serif text-base font-bold text-[#3E2723]">
                    2. Cake Specifications
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Cake Aesthetic Style *</label>
                      <select
                        value={cakeType}
                        onChange={e => setCakeType(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      >
                        {sampleCakeTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Size / Weight *</label>
                      <select
                        value={cakeSize}
                        onChange={e => setCakeSize(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      >
                        <option value="1 kg (Serves 8-10)">1 kg (Serves 8-10)</option>
                        <option value="1.5 kg (Serves 12-14)">1.5 kg (Serves 12-14)</option>
                        <option value="2 kg (Serves 16-20)">2 kg (Serves 16-20)</option>
                        <option value="2.5 kg 2-Tier (Serves 22-26)">2.5 kg 2-Tier (Serves 22-26)</option>
                        <option value="3 kg+ Multi-tier">3 kg+ Grand Celebration Tier</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-[#4A352F]">Flavour Profile *</label>
                      <select
                        value={flavour}
                        onChange={e => setFlavour(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      >
                        {sampleFlavours.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-3 pt-3 border-t border-[#FAF7F2]">
                  <h3 className="font-serif text-base font-bold text-[#3E2723]">
                    3. Date & Schedule
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#9E5D4E]" />
                        <span>Celebration Date * (Min 48hr notice)</span>
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#9E5D4E]" />
                        <span>Delivery Time</span>
                      </label>
                      <input
                        type="time"
                        value={preferredTime}
                        onChange={e => setPreferredTime(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>
                  </div>
                </div>

                {/* Theme & Custom text */}
                <div className="space-y-3 pt-3 border-t border-[#FAF7F2]">
                  <h3 className="font-serif text-base font-bold text-[#3E2723]">
                    4. Theme & Customization Notes
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Theme / Color Scheme</label>
                      <input
                        type="text"
                        placeholder="e.g. Pastel lavender, sage accents, edible gold leaf ribbons"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Lettering / Cake Writing</label>
                      <input
                        type="text"
                        placeholder="e.g. Happy 30th Birthday Maya ✨"
                        value={customMessage}
                        onChange={e => setCustomMessage(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#4A352F]">Dietary & Special Requirements</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. 100% Eggless, low sugar, gluten-sensitive, no artificial colouring..."
                        value={specialRequirements}
                        onChange={e => setSpecialRequirements(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EBDCCB] text-xs text-[#3E2723] focus:outline-none focus:border-[#9E5D4E] resize-none"
                      />
                    </div>

                    {/* Image upload */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#4A352F] block">
                        Reference Photo / Pinterest Inspo (Optional)
                      </label>
                      <div className="border-2 border-dashed border-[#EBDCCB] rounded-2xl p-4 text-center bg-[#FAF7F2] hover:bg-[#FCEEEB]/40 transition-colors">
                        {referenceImage ? (
                          <div className="space-y-2">
                            <img
                              src={referenceImage}
                              alt="Cake reference preview"
                              className="w-28 h-28 object-cover rounded-xl mx-auto shadow-xs border border-[#EBDCCB]"
                            />
                            <button
                              type="button"
                              onClick={() => setReferenceImage('')}
                              className="text-xs text-[#9E5D4E] underline font-semibold"
                            >
                              Remove photo
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer space-y-1 block">
                            <Upload className="w-6 h-6 text-[#9E5D4E] mx-auto" />
                            <p className="text-xs font-semibold text-[#3E2723]">
                              Click or drop image to upload reference
                            </p>
                            <p className="text-[10px] text-[#8C7A74]">
                              PNG, JPG, or WebP up to 5MB
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-custom-cake-btn"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#9E5D4E] hover:bg-[#85473A] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Request Custom Cake'}</span>
                </button>

              </form>
            </div>

            {/* Inspiration Visuals Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FDFBF7] rounded-3xl p-6 border border-[#EBDCCB] space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#3E2723]">
                  Bespoke Atelier Portfolio
                </h3>
                <p className="text-xs text-[#735D54]">
                  Browse recent custom creations designed and baked right in our Indiranagar kitchen.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl overflow-hidden aspect-square bg-[#F5EBE1] border border-[#EBDCCB]">
                    <img
                      src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=80"
                      alt="2-tier Lambeth"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square bg-[#F5EBE1] border border-[#EBDCCB]">
                    <img
                      src="https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=500&q=80"
                      alt="Pastel bloom"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square bg-[#F5EBE1] border border-[#EBDCCB]">
                    <img
                      src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=500&q=80"
                      alt="Caramel drip"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-square bg-[#F5EBE1] border border-[#EBDCCB]">
                    <img
                      src="https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=500&q=80"
                      alt="Cupcakes tower"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                {/* Testimonial highlight */}
                <div className="pt-4 border-t border-[#FAF7F2] space-y-1">
                  <div className="flex text-[#F59E0B] gap-1">
                    {'★★★★★'}
                  </div>
                  <p className="font-serif italic text-xs text-[#3E2723]">
                    “They sculpted our 2-tier wedding cake down to every delicate ribbon petal. Unforgettable taste!”
                  </p>
                  <p className="text-[10px] text-[#8C7A74]">— Tanya & Neil</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
