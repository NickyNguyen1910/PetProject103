'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.message);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { level: 1, label: 'Yếu', color: 'bg-red-500' };
    if (p.length < 10) return { level: 2, label: 'Trung bình', color: 'bg-yellow-500' };
    return { level: 3, label: 'Mạnh', color: 'bg-green-500' };
  };
  const strength = passwordStrength();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-[#1a1a2e] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">✦</span>
              <span className="text-2xl font-bold gradient-text">StarCard</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4 mb-1">Tạo tài khoản</h1>
            <p className="text-gray-400 text-sm">Tham gia cộng đồng fan K-pop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tên hiển thị</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tên của bạn"
                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(l => (
                      <div key={l} className={`h-1 flex-1 rounded-full transition-colors ${l <= strength.level ? strength.color : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  form.confirm && form.confirm !== form.password ? 'border-red-500/50' : 'border-white/10 focus:border-pink-500/50'
                }`}
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-400 mt-1">Mật khẩu không khớp</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-pink-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang tạo tài khoản...
                </span>
              ) : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-pink-400 hover:text-pink-300 font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
