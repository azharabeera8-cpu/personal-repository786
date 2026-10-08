import React, { useState, useEffect } from 'react';
import { CustomerFeedback } from '../types';
import { api } from '../services/api';
import { useStore } from '../context/StoreContext';
import { Star, MessageSquareHeart, CheckCircle2, Sparkles } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const { showToast } = useStore();

  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await api.getFeedback();
      setFeedbacks(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill all required feedback fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const saved = await api.submitFeedback({
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim(),
      });
      setFeedbacks([saved, ...feedbacks]);
      setSubmitted(true);
      showToast('Thank you for your valuable feedback!');
    } catch {
      showToast('Could not submit feedback. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A880] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voice of Our Customers</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A1116] font-normal tracking-tight">
            Customer Feedback
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2 mb-3" />
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            We cherish your reflections on our fabrics, stitching, and service. Your words help us craft perfection with every collection.
          </p>
        </div>

        {/* Feedback Submission Card */}
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-xl border border-[#E8DFD4] shadow-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl text-stone-900 font-medium">
                Thank you for your valuable feedback!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light">
                Your thoughts have been recorded in our system. The RANGMAHAL creative team reviews customer feedback directly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                  setRating(5);
                }}
                className="px-6 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26]"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 border-b border-[#E8DFD4] pb-3 text-stone-900 font-serif-luxury text-lg">
                <MessageSquareHeart className="w-5 h-5 text-[#800020]" />
                <span>Share Your RANGMAHAL Experience</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maryam Bilal"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
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
                    placeholder="maryam@example.pk"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              {/* Rating selection (1 to 5 stars) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 text-stone-300 hover:text-[#D4AF37] transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 font-mono">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Your Message & Thoughts *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you loved about the fabric, embroidery, fitting, packaging, or customer service..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 text-xs sm:text-sm font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {submitting ? 'Submitting...' : 'Submit Valuable Feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Existing Customer Reflections */}
        <div className="space-y-4">
          <h2 className="font-serif-luxury text-xl text-stone-900 border-b border-[#E8DFD4] pb-2">
            Recent Client Reflections ({feedbacks.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-5 bg-white rounded-lg border border-[#EBE4DC] space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-stone-900">{fb.name}</span>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  "{fb.message}"
                </p>
                <div className="text-[10px] font-mono text-stone-400">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
