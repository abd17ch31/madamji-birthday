import React, { useState, useEffect } from 'react';
import { Wish } from '../types';
import { useImages } from '../context/ImageContext';
import {
  Lock,
  KeyRound,
  Trash2,
  Printer,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Sparkles,
  Heart
} from 'lucide-react';
import { FaMoon } from 'react-icons/fa6';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('jyoti_admin_token'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs: 'wishes' | 'images'
  const [activeTab, setActiveTab] = useState<'wishes' | 'images'>('wishes');

  // Wishes state
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(false);
  const [wishActionMsg, setWishActionMsg] = useState('');

  // Image slots state
  const { slots, updateImageSlot, refreshImages } = useImages();
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [imageSuccessMsg, setImageSuccessMsg] = useState('');

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoggingIn(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        sessionStorage.setItem('jyoti_admin_token', data.token);
      } else {
        setAuthError(data.error || 'Incorrect password. Please try again.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('jyoti_admin_token');
  };

  // Fetch Wishes (Protected)
  const fetchWishes = async () => {
    if (!token) return;
    setIsLoadingWishes(true);
    try {
      const res = await fetch('/api/admin/wishes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWishes(data.wishes || []);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch {
      // safe
    } finally {
      setIsLoadingWishes(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishes();
    }
  }, [token]);

  // Delete single wish
  const handleDeleteWish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wish?')) return;
    try {
      const res = await fetch(`/api/admin/wishes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWishes(prev => prev.filter(w => w.id !== id));
        setWishActionMsg('Wish deleted.');
        setTimeout(() => setWishActionMsg(''), 3000);
      }
    } catch {
      // safe
    }
  };

  // Replace Image in Slot
  const handleImageUpload = async (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlotId(slotId);
    setImageSuccessMsg('');

    try {
      // Convert to Base64 for instant upload to backend store / Supabase
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        const res = await fetch(`/api/admin/images/${slotId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageData: base64Data }),
        });

        if (res.ok) {
          const data = await res.json();
          await updateImageSlot(slotId, data.url || base64Data);
          setImageSuccessMsg('Image updated successfully! ✨');
          setTimeout(() => setImageSuccessMsg(''), 3000);
        } else {
          // Fallback direct local update
          await updateImageSlot(slotId, base64Data);
          setImageSuccessMsg('Image updated! ✨');
          setTimeout(() => setImageSuccessMsg(''), 3000);
        }
        setUploadingSlotId(null);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingSlotId(null);
    }
  };

  // Export all wishes as PDF via native browser print stylesheet
  const handleExportPDF = () => {
    window.print();
  };

  // If not authenticated, render Login Screen
  if (!token) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[#FAD9E0]">
        <div className="w-full max-w-md bg-[#FFF9FA] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#FFCCD5] paper-texture text-center">
          <div className="w-12 h-12 rounded-full bg-[#FFB3C6]/40 flex items-center justify-center mx-auto text-[#642825] mb-4">
            <Lock className="w-6 h-6 text-[#B85D59]" />
          </div>

          <h2 className="font-caveat text-4xl text-[#642825] font-bold mb-2">
            Admin Keepsake Portal
          </h2>

          <p className="font-quicksand text-xs sm:text-sm text-[#B85D59] mb-6">
            Enter your admin password to view all birthday wishes and manage photo slots.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                required
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#FAD9E0] text-[#642825] placeholder:text-[#B85D59]/40 font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB3C6]"
              />
            </div>

            {authError && (
              <p className="text-xs text-[#C62828] font-quicksand font-semibold bg-[#FFEBEE] p-2 rounded-lg">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#FFB3C6] hover:bg-[#ffa2b9] text-[#642825] font-quicksand font-bold text-sm rounded-full shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn ? 'Verifying...' : 'Unlock Admin Panel'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#FAD9E0] flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-[#B85D59] hover:text-[#642825] font-quicksand font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Birthday Site</span>
            </button>

            <span className="text-[11px] text-[#B85D59]/60 font-quicksand">
              Private Access
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FAD9E0] text-[#642825] font-quicksand pb-16">
      {/* Hidden Print Container for PDF Export (One wish per page) */}
      <div className="hidden print:block">
        {wishes.length === 0 ? (
          <div className="print-page text-center">
            <h1 className="font-caveat text-4xl mb-4">Jyoti's Birthday Wishes Collection</h1>
            <p className="font-quicksand text-base">No wishes recorded yet.</p>
          </div>
        ) : (
          wishes.map((wish, idx) => (
            <div key={wish.id} className="print-page border-b border-pink-200">
              <div className="max-w-xl w-full text-center space-y-6">
                <div className="text-xs uppercase tracking-widest text-[#B85D59] font-bold">
                  Birthday Wish · Keepsake #{idx + 1}
                </div>

                <h2 className="font-caveat text-5xl font-bold text-[#642825]">
                  From {wish.author}
                </h2>

                <p className="font-quicksand text-lg leading-relaxed text-[#642825] whitespace-pre-wrap">
                  "{wish.message}"
                </p>

                <div className="text-xs text-[#B85D59] pt-6 border-t border-pink-100">
                  Received on {new Date(wish.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Admin UI (no-print) */}
      <div className="no-print max-w-5xl mx-auto px-4 py-8">
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:px-6 shadow-sm border border-[#FFCCD5] mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-[#FFF8F9] hover:bg-[#FAD9E0] text-[#642825] transition-colors cursor-pointer"
              title="Return to public site"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-caveat text-3xl font-bold text-[#642825] flex items-center gap-2">
                <span>Jyoti's Admin Keepsake</span>
                <FaMoon className="text-[#E8B86D] text-lg" />
              </h1>
              <p className="text-xs text-[#B85D59]">
                Manage guest wishes and swap photos live
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF8F9] hover:bg-[#FFEBEE] text-[#C62828] text-xs font-semibold border border-[#FFCDD2] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Admin</span>
            </button>
          </div>
        </header>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-quicksand font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
              activeTab === 'wishes'
                ? 'bg-[#FFB3C6] text-[#642825] border border-white/60'
                : 'bg-white/80 hover:bg-white text-[#B85D59]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishes Collection ({wishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-quicksand font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs ${
              activeTab === 'images'
                ? 'bg-[#FFB3C6] text-[#642825] border border-white/60'
                : 'bg-white/80 hover:bg-white text-[#B85D59]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Slots ({slots.length})</span>
          </button>
        </div>

        {/* Tab 1: Wishes */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 rounded-2xl p-4 border border-[#FFCCD5]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#642825]">
                  Total Wishes: {wishes.length}
                </span>
                {wishActionMsg && (
                  <span className="text-xs text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md font-semibold animate-fade-in">
                    {wishActionMsg}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchWishes}
                  disabled={isLoadingWishes}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FAD9E0] text-[#642825] rounded-full text-xs font-semibold border border-[#FAD9E0] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWishes ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FFB3C6] hover:bg-[#ffa2b9] text-[#642825] rounded-full text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Save as PDF (Print)</span>
                </button>
              </div>
            </div>

            {wishes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#FFCCD5] space-y-3">
                <Heart className="w-10 h-10 text-[#FFB3C6] mx-auto" />
                <h3 className="font-caveat text-3xl font-bold text-[#642825]">
                  No Wishes Submitted Yet
                </h3>
                <p className="text-xs sm:text-sm text-[#B85D59] max-w-sm mx-auto">
                  When Jyoti's friends visit the link and submit their messages, they will appear right here privately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishes.map(wish => (
                  <div
                    key={wish.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-[#FFCCD5] flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#FAD9E0] pb-2 mb-3">
                        <span className="font-caveat text-2xl font-bold text-[#642825]">
                          From: {wish.author}
                        </span>
                        <span className="text-[11px] text-[#B85D59]/70">
                          {new Date(wish.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#642825] leading-relaxed whitespace-pre-wrap">
                        {wish.message}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#FAD9E0] flex justify-end">
                      <button
                        onClick={() => handleDeleteWish(wish.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Image Slots */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="bg-white/70 rounded-2xl p-4 border border-[#FFCCD5] flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#642825]">
                  Website Image Slot Manager
                </h3>
                <p className="text-xs text-[#B85D59]">
                  Upload new photos to immediately replace images across the entire birthday website.
                </p>
              </div>
              {imageSuccessMsg && (
                <span className="text-xs text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-md font-semibold animate-fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{imageSuccessMsg}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map(slot => (
                <div
                  key={slot.id}
                  className="bg-white rounded-2xl p-4 border border-[#FFCCD5] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#642825] truncate">
                        {slot.title}
                      </span>
                      <span className="text-[10px] text-[#B85D59] bg-[#FAD9E0] px-1.5 py-0.5 rounded font-mono">
                        {slot.aspectRatio}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#B85D59]/80 mb-3 line-clamp-2">
                      {slot.description}
                    </p>

                    {/* Preview */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAD9E0]/40 border border-[#FAD9E0] mb-3">
                      <img
                        src={slot.currentUrl}
                        alt={slot.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Upload / Replace Button */}
                  <div>
                    <label className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FFB3C6] hover:bg-[#ffa2b9] text-[#642825] rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-98">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingSlotId === slot.id ? 'Uploading...' : 'Replace Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleImageUpload(slot.id, e)}
                        disabled={uploadingSlotId === slot.id}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
