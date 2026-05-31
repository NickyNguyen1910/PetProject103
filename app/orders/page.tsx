'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

const statusConfig = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  shipped: { label: 'Đang giao', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  delivered: { label: 'Đã giao', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (user) {
      const all: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(all.filter(o => o.userId === user.id));
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex items-center justify-center min-h-96 text-gray-400">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Đơn hàng của tôi</h1>
        <Link href="/products" className="text-pink-400 hover:text-pink-300 text-sm">Mua thêm →</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-7xl mb-6">📦</div>
          <h2 className="text-xl font-bold text-white mb-3">Chưa có đơn hàng nào</h2>
          <p className="text-gray-400 mb-8">Hãy đặt mua những photocard yêu thích của bạn</p>
          <Link href="/products" className="bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-white font-bold px-8 py-3.5 rounded-2xl hover:opacity-90">
            Mua ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status];
            return (
              <div key={order.id} className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-5">
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/5">
                  <div>
                    <p className="text-xs text-gray-500">Mã đơn hàng</p>
                    <p className="font-mono font-bold text-pink-400">{order.id}</p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-xs text-gray-500">Ngày đặt</p>
                    <p className="text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 3).map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-pink-400">{item.product.group}</p>
                        <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-white flex-shrink-0">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{order.items.length - 3} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ: {order.shippingInfo.address}, {order.shippingInfo.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Tổng tiền</p>
                    <p className="text-lg font-bold text-white">{order.total.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
