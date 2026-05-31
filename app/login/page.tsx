'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.message);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'demo@starcard.vn', password: 'demo123' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-3xl">✦</span>
              <span className="text-2xl font-bold gradient-text">StarCard</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4 mb-1">Chào mừng trở lại</h1>
            <p className="text-gray-400 text-sm">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {/* Demo account hint */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6 text-sm text-blue-400">
            <p className="font-medium mb-1">Tài khoản demo:</p>
            <p>Email: <code className="text-blue-300">demo@starcard.vn</code></p>
            <p>Mật khẩu: <code className="text-blue-300">demo123</code></p>
            <button onClick={fillDemo} className="mt-2 text-xs underline text-blue-400 hover:text-blue-300">
              Điền tự động →
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
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
                  Đang đăng nhập...
                </span>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-pink-400 hover:text-pink-300 font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
