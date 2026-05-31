'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import Toast from '@/components/Toast';

const cardTypeLabel: Record<string, { label: string; color: string }> = {
  limited: { label: 'Limited Edition', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  special: { label: 'Special Edition', color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  photocard: { label: 'Photocard', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  trading: { label: 'Trading Card', color: 'text-green-400 border-green-500/40 bg-green-500/10' },
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const product = products.find(p => p.id === id);
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <p className="text-gray-400 text-lg">Không tìm thấy sản phẩm</p>
        <Link href="/products" className="text-pink-400 hover:text-pink-300">← Quay lại</Link>
      </div>
    );
  }

  const related = products.filter(p => p.group === product.group && p.id !== product.id).slice(0, 4);
  const typeInfo = cardTypeLabel[product.cardType];
  const inCart = items.some(i => i.product.id === product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setToast({ message: `Đã thêm ${product.name} vào giỏ hàng!`, type: 'success' });
  };

  const handleBuyNow = () => {
    if (!user) {
      setToast({ message: 'Vui lòng đăng nhập để mua hàng', type: 'error' });
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-white">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white">Sản phẩm</Link>
        <span>/</span>
        <Link href={`/products?group=${product.group}`} className="hover:text-white">{product.group}</Link>
        <span>/</span>
        <span className="text-gray-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[3/4] max-w-md mx-auto w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-pink-500/10">
            <Image
              src={product.image}
              alt={`${product.name} - ${product.group}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,20,0.3),transparent)]" />
            {product.isNew && (
              <div className="absolute top-4 left-4">
                <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Mới</span>
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">-{discount}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Group & Type */}
          <div className="flex items-center gap-3 mb-3">
            <Link href={`/products?group=${product.group}`} className="text-pink-400 font-semibold text-sm hover:text-pink-300">
              {product.group}
            </Link>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-sm">{product.rating} ({product.reviews.toLocaleString()} đánh giá)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-white">{product.price.toLocaleString('vi-VN')}đ</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through mb-1">{product.originalPrice.toLocaleString('vi-VN')}đ</span>
            )}
            {discount > 0 && (
              <span className="mb-1 text-sm bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Tiết kiệm {(product.originalPrice! - product.price).toLocaleString('vi-VN')}đ</span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.tags.map(tag => (
              <span key={tag} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 20 ? 'bg-green-400' : product.stock > 5 ? 'bg-yellow-400' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-400">
              {product.stock > 20 ? 'Còn hàng' : `Chỉ còn ${product.stock} sản phẩm`}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-400">Số lượng:</span>
            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-white font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 border border-pink-500/50 text-pink-400 hover:bg-pink-500/10 font-semibold px-6 py-3.5 rounded-2xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {inCart ? 'Thêm nữa' : 'Thêm vào giỏ'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 text-white font-bold px-6 py-3.5 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-pink-500/20"
            >
              Mua ngay
            </button>
          </div>

          {/* Delivery info */}
          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-4 space-y-3">
            {[
              { icon: '🚚', text: 'Miễn phí vận chuyển đơn từ 200k' },
              { icon: '🔄', text: 'Đổi trả trong 7 ngày nếu lỗi sản phẩm' },
              { icon: '🛡️', text: 'Photocard chính hãng, đảm bảo chất lượng' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-gray-400">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Sản phẩm cùng nhóm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
