'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { products, groups, cardTypes } from '@/data/products';
import ProductCard from '@/components/ProductCard';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialGroup = searchParams.get('group') || 'Tất cả';

  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedGroup !== 'Tất cả') list = list.filter(p => p.group === selectedGroup);
    if (selectedType !== 'Tất cả') list = list.filter(p => p.cardType === selectedType);
    if (search) list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.group.toLowerCase().includes(search.toLowerCase())
    );
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'popular') list.sort((a, b) => b.reviews - a.reviews);

    return list;
  }, [selectedGroup, selectedType, sortBy, search, priceRange]);

  const typeLabels: Record<string, string> = {
    'Tất cả': 'Tất cả',
    photocard: 'Photocard',
    trading: 'Trading',
    limited: 'Limited',
    special: 'Special',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tất cả sản phẩm</h1>
        <p className="text-gray-400">{filtered.length} sản phẩm</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/5 sticky top-20">
            {/* Search */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2 block">Tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tên idol, nhóm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Group Filter */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3 block">Nhóm</label>
              <div className="flex flex-col gap-1">
                {groups.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGroup(g)}
                    className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedGroup === g
                        ? 'bg-pink-500/20 text-pink-400 font-semibold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Type */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3 block">Loại card</label>
              <div className="flex flex-col gap-1">
                {cardTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                      selectedType === t
                        ? 'bg-purple-500/20 text-purple-400 font-semibold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3 block">
                Giá: {priceRange[0].toLocaleString('vi-VN')}đ - {priceRange[1].toLocaleString('vi-VN')}đ
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setSelectedGroup('Tất cả');
                setSelectedType('Tất cả');
                setSearch('');
                setPriceRange([0, 100000]);
                setSortBy('default');
              }}
              className="w-full text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 rounded-xl transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-400">
              Hiển thị <span className="text-white font-semibold">{filtered.length}</span> sản phẩm
            </p>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[#1a1a2e] border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-xl focus:outline-none focus:border-pink-500/50"
            >
              <option value="default">Mặc định</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-sm mt-2">Thử thay đổi bộ lọc của bạn</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-96 text-gray-400">Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
