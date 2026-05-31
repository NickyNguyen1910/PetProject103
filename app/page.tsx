import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const featured = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 8);
  const groups = ['BTS', 'BLACKPINK', 'aespa', 'NewJeans', 'IVE', 'Stray Kids', 'Cortis'];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a14_0%,#1a0a2e_50%,#0a0a14_100%)]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        {/* Floating card previews */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:flex gap-4 opacity-70">
          {[products[0], products[7], products[10], products[22]].map((p, i) => (
            <div
              key={p.id}
              className="w-28 h-36 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              style={{ transform: `rotate(${(i - 1.5) * 5}deg) translateY(${Math.abs(i - 1.5) * 12}px)` }}
            >
              <Image src={p.image} alt={p.name} width={112} height={144} className="object-cover w-full h-full" />
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 px-4 py-2 rounded-full text-sm text-pink-400 font-medium mb-6">
              <span className="w-2 h-2 bg-pink-400 rounded-full" />
              Photocard bo góc chính hãng
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 text-white">
              Sưu Tầm<br />
              <span className="gradient-text">Photocard Idol</span><br />
              Yêu Thích
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Khám phá bộ sưu tập photocard từ các idol K-pop hàng đầu.
              Chất liệu cao cấp, bo góc tinh tế.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-pink-500/25"
              >
                Mua ngay
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[{ value: '30+', label: 'Idols' }, { value: '8', label: 'Nhóm' }, { value: '1000+', label: 'Đã bán' }].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Nhóm nổi bật</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {groups.map(group => (
            <Link
              key={group}
              href={`/products?group=${encodeURIComponent(group)}`}
              className="group flex flex-col items-center gap-2 bg-[#1a1a2e] hover:bg-[#22223e] border border-white/5 hover:border-pink-500/30 rounded-2xl p-4 transition-all"
            >
              <div className="w-12 h-12 bg-[linear-gradient(135deg,rgba(236,72,153,0.2),rgba(139,92,246,0.2))] rounded-full flex items-center justify-center text-xl">✦</div>
              <span className="text-xs font-semibold text-gray-300 group-hover:text-white text-center">{group}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Bán chạy nhất</h2>
            <p className="text-gray-400 text-sm mt-1">Được yêu thích nhất bởi cộng đồng fan</p>
          </div>
          <Link href="/products" className="text-pink-400 hover:text-pink-300 text-sm font-medium">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Mới về</h2>
            <p className="text-gray-400 text-sm mt-1">Những photocard vừa ra mắt</p>
          </div>
          <Link href="/products" className="text-pink-400 hover:text-pink-300 text-sm font-medium">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="mx-4 mb-16">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[linear-gradient(135deg,rgba(236,72,153,0.1),rgba(139,92,246,0.15))] border border-white/10 p-12 text-center">
          <p className="text-pink-400 font-semibold mb-2">Ưu đãi đặc biệt</p>
          <h3 className="text-3xl font-bold text-white mb-4">Miễn phí vận chuyển đơn từ 200k</h3>
          <p className="text-gray-400 mb-6">Áp dụng cho tất cả đơn hàng trong tháng này</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-3 rounded-2xl hover:bg-gray-100 transition-colors">
            Mua ngay →
          </Link>
        </div>
      </section>
    </div>
  );
}
