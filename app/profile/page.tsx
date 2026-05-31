'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/Toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout, isLoading } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (user) setForm({ name: user.name, phone: user.phone || '', address: user.address || '' });
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-96 text-gray-400">Đang tải...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser({ name: form.name, phone: form.phone, address: form.address });
    setSaving(false);
    setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-3xl font-bold text-white mb-8">Tài khoản của tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar & Info card */}
        <div className="md:col-span-1">
          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-sm text-gray-400 mt-1 break-all">{user.email}</p>
            <div className="mt-4 text-xs text-gray-500">
              Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
            >
              🚪 Đăng xuất
            </button>
          </div>

          {/* Quick links */}
          <div className="mt-4 bg-[#1a1a2e] border border-white/5 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Nhanh đến</h3>
            <div className="space-y-1">
              {[
                { href: '/orders', icon: '📦', label: 'Đơn hàng của tôi' },
                { href: '/cart', icon: '🛒', label: 'Giỏ hàng' },
                { href: '/products', icon: '🛍️', label: 'Mua sắm' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="md:col-span-2">
          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Thông tin cá nhân</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-600 mt-1">Email không thể thay đổi</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="0xxxxxxxxx"
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ giao hàng</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
