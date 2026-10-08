import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill all required contact fields', 'error');
      return;
    }
    setSent(true);
    showToast('Your message has been sent to RANGMAHAL Care!');
  };

  return (
    <div className="py-14 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-2">
            Client Assistance
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A1116] font-normal tracking-tight">
            Contact RANGMAHAL
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2 mb-3" />
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Whether inquiring about wedding bookings, custom fittings, or order dispatches across Pakistan, our atelier team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FDFBF7] p-8 rounded-xl border border-[#E8DFD4] shadow-xs space-y-6">
              
              <h2 className="font-serif-luxury text-xl text-stone-900 font-medium border-b border-[#E8DFD4] pb-3">
                Flagship Atelier & Care
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Lahore Flagship</strong>
                    <span className="text-stone-600 font-light">
                      42-B, M.M. Alam Road, Gulberg III, Lahore, Punjab, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">UAN Helpline</strong>
                    <span className="text-stone-600 font-mono">+92 42 3578 9012 / 0300-RANGMAHAL</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Email Support</strong>
                    <span className="text-stone-600">care@rangmahal.pk</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Operating Hours</strong>
                    <span className="text-stone-600 font-light">
                      Mon – Sat: 11:00 AM – 10:00 PM (PKT)
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Chat Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on Official WhatsApp (+92 300 1234567)</span>
                </a>
              </div>

            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FDFBF7] p-8 rounded-xl border border-[#E8DFD4] shadow-xs">
              
              {sent ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-luxury text-2xl text-stone-900 font-medium">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light">
                    Our customer concierge will review your message and reply via email or phone within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26]"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif-luxury text-xl font-medium text-stone-900 border-b border-[#E8DFD4] pb-3">
                    Send Us an Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Zainab Siddiqui"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="zainab@example.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Inquire about custom stitching, bridal orders, bulk booking or tracking..."
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 text-xs sm:text-sm font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
