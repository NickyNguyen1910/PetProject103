'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const cardTypeLabel: Record<string, { label: string; color: string }> = {
  limited: { label: 'Limited', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  special: { label: 'Special', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  photocard: { label: 'Photocard', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  trading: { label: 'Trading', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some(i => i.product.id === product.id);
  const typeInfo = cardTypeLabel[product.cardType];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative bg-[#1a1a2e] rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:-translate-y-1">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.name} - ${product.group}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/90 text-white font-semibold">
                Mới
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/90 text-white font-semibold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Best seller badge */}
          {product.isBestSeller && (
            <div className="absolute top-3 right-3">
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/90 text-white font-semibold">
                ⭐ Top
              </span>
            </div>
          )}

          {/* Card type */}
          <div className="absolute bottom-3 left-3">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-pink-400 font-medium mb-1">{product.group}</p>
          <h3 className="font-bold text-white text-base leading-tight mb-2 truncate">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price & Add to cart */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-lg font-bold text-white">
                {product.price.toLocaleString('vi-VN')}đ
              </div>
              {product.originalPrice && (
                <div className="text-xs text-gray-500 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </div>
              )}
            </div>
            <button
              onClick={handleAdd}
              className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
                added || inCart
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30 hover:scale-105'
              }`}
            >
              {added ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>

          {/* Stock warning */}
          {product.stock <= 20 && (
            <p className="text-xs text-orange-400 mt-2">
              Còn {product.stock} sản phẩm
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
