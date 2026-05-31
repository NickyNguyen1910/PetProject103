'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const shipping = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-3">Giỏ hàng trống</h2>
        <p className="text-gray-400 mb-8 text-center">Hãy thêm những photocard yêu thích vào giỏ hàng</p>
        <Link
          href="/products"
          className="bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-white font-bold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-all hover:scale-105"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Giỏ hàng
          <span className="ml-3 text-lg font-normal text-gray-400">({totalItems} sản phẩm)</span>
        </h1>
        <Link href="/products" className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1">
          ← Tiếp tục mua
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.product.id}
              className="bg-[#1a1a2e] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex gap-4 transition-colors"
            >
              <Link href={`/products/${item.product.id}`} className="relative w-20 h-26 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                <div className="w-20 h-28 relative">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-xl"
                    sizes="80px"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-pink-400 font-medium">{item.product.group}</p>
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-bold text-white hover:text-pink-300 transition-colors">{item.product.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.product.cardType}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-white font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-500">{item.product.price.toLocaleString('vi-VN')}đ/cái</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 sticky top-20">
            <h2 className="text-lg font-bold text-white mb-6">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tạm tính ({totalItems} sản phẩm)</span>
                <span className="text-white">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vận chuyển</span>
                <span className={shipping === 0 ? 'text-green-400 font-semibold' : 'text-white'}>
                  {shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-500 bg-white/5 rounded-lg px-3 py-2">
                  Mua thêm <span className="text-pink-400 font-semibold">{(200000 - subtotal).toLocaleString('vi-VN')}đ</span> để được miễn phí vận chuyển
                </p>
              )}
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-white">Tổng cộng</span>
                <span className="text-xl font-extrabold text-white">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-pink-500/20"
              >
                Tiến hành thanh toán
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all"
                >
                  Đăng nhập để thanh toán
                </Link>
                <p className="text-center text-xs text-gray-500">
                  Chưa có tài khoản?{' '}
                  <Link href="/register" className="text-pink-400 hover:text-pink-300">Đăng ký</Link>
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>🔒</span>
              <span>Thanh toán bảo mật SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
