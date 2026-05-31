'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Order, ShippingInfo } from '@/types';

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Biên Hòa', 'Nha Trang', 'Huế', 'Đà Lạt'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [payMethod, setPayMethod] = useState<'cod' | 'bank' | 'momo'>('cod');
  const [form, setForm] = useState<ShippingInfo>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Hà Nội',
    note: '',
  });
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const shipping = subtotal >= 200000 ? 0 : 30000;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (items.length === 0 && step !== 'success') { router.push('/cart'); return; }
  }, [user, items, router, step]);

  const validate = () => {
    const e: Partial<ShippingInfo> = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.match(/^[0-9]{10}$/)) e.phone = 'Số điện thoại không hợp lệ (10 số)';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ';
    if (!form.email.includes('@')) e.email = 'Email không hợp lệ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirmOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const id = 'SC' + Date.now().toString().slice(-8);
    setOrderId(id);

    const order: Order = {
      id,
      userId: user!.id,
      items,
      subtotal,
      shipping,
      total,
      status: 'confirmed',
      shippingInfo: form,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([order, ...orders]));

    clearCart();
    setLoading(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">Đặt hàng thành công!</h1>
        <p className="text-gray-400 mb-2">Mã đơn hàng của bạn: <span className="text-pink-400 font-bold font-mono">{orderId}</span></p>
        <p className="text-gray-500 text-sm mb-8">Chúng tôi sẽ gửi xác nhận đến <span className="text-white">{form.email}</span></p>

        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-white mb-4">Thông tin giao hàng</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">Người nhận:</span> <span className="text-white font-medium">{form.fullName}</span></p>
            <p><span className="text-gray-400">SĐT:</span> <span className="text-white">{form.phone}</span></p>
            <p><span className="text-gray-400">Địa chỉ:</span> <span className="text-white">{form.address}, {form.city}</span></p>
            <p><span className="text-gray-400">Thanh toán:</span> <span className="text-white">
              {payMethod === 'cod' ? 'COD - Thanh toán khi nhận hàng' : payMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'Ví MoMo'}
            </span></p>
            <p><span className="text-gray-400">Tổng tiền:</span> <span className="text-pink-400 font-bold">{total.toLocaleString('vi-VN')}đ</span></p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/orders" className="border border-white/20 hover:border-white/40 text-gray-300 hover:text-white px-6 py-3 rounded-2xl transition-all">
            Xem đơn hàng
          </Link>
          <Link href="/products" className="bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90">
            Tiếp tục mua
          </Link>
        </div>
      </div>
    );
  }

  const InputField = ({ label, field, type = 'text', placeholder }: { label: string; field: keyof ShippingInfo; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        placeholder={placeholder}
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
          errors[field] ? 'border-red-500/50' : 'border-white/10 focus:border-pink-500/50'
        }`}
      />
      {errors[field] && <p className="text-xs text-red-400 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Thanh toán</h1>
        <div className="flex items-center gap-2 mt-4">
          {['Thông tin', 'Thanh toán'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i === 0 && step === 'info' ? 'bg-pink-500 text-white' :
                i === 1 && step === 'payment' ? 'bg-pink-500 text-white' :
                'bg-white/10 text-gray-400'
              }`}>{i + 1}</div>
              <span className={`text-sm ${i === 0 && step === 'info' || i === 1 && step === 'payment' ? 'text-white' : 'text-gray-500'}`}>{s}</span>
              {i === 0 && <div className="w-12 h-px bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'info' && (
            <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-white">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Họ và tên *" field="fullName" placeholder="Nguyễn Văn A" />
                <InputField label="Số điện thoại *" field="phone" type="tel" placeholder="0xxxxxxxxx" />
              </div>
              <InputField label="Email *" field="email" type="email" placeholder="email@example.com" />
              <InputField label="Địa chỉ *" field="address" placeholder="Số nhà, tên đường, phường/xã" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tỉnh / Thành phố</label>
                <select
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-[#12121f] border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white focus:outline-none"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ghi chú (không bắt buộc)</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder="Ghi chú cho đơn hàng..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none"
                />
              </div>
              <button
                onClick={() => { if (validate()) setStep('payment'); }}
                className="w-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all"
              >
                Tiếp tục →
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep('info')} className="text-gray-400 hover:text-white transition-colors">
                  ←
                </button>
                <h2 className="text-lg font-bold text-white">Phương thức thanh toán</h2>
              </div>

              {[
                { id: 'cod', label: 'COD - Thanh toán khi nhận hàng', icon: '💵', desc: 'Trả tiền mặt khi nhận hàng' },
                { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦', desc: 'Vietcombank, Techcombank, MB Bank...' },
                { id: 'momo', label: 'Ví MoMo', icon: '💜', desc: 'Thanh toán nhanh qua ví MoMo' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPayMethod(method.id as 'cod' | 'bank' | 'momo')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    payMethod === method.id
                      ? 'border-pink-500/50 bg-pink-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                  <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    payMethod === method.id ? 'border-pink-500' : 'border-white/20'
                  }`}>
                    {payMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />}
                  </div>
                </button>
              ))}

              {payMethod === 'bank' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
                  <p className="font-semibold mb-2">Thông tin chuyển khoản:</p>
                  <p>STK: <span className="font-mono font-bold">1234 5678 9012</span></p>
                  <p>Ngân hàng: Vietcombank</p>
                  <p>Chủ TK: STARCARD SHOP</p>
                  <p className="text-xs mt-2 text-blue-400">Nội dung: {user?.name} - {orderId || 'Đơn hàng'}</p>
                </div>
              )}

              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className="w-full bg-[linear-gradient(135deg,#ec4899,#8b5cf6)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-pink-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : `Xác nhận đặt hàng • ${total.toLocaleString('vi-VN')}đ`}
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 h-fit sticky top-20">
          <h2 className="text-lg font-bold text-white mb-5">Đơn hàng ({items.length} sản phẩm)</h2>
          <div className="space-y-4 mb-5 max-h-72 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.product.id} className="flex gap-3">
                <div className="relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-pink-400">{item.product.group}</p>
                  <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tạm tính</span>
              <span className="text-white">{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vận chuyển</span>
              <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                {shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10">
              <span className="font-bold text-white">Tổng cộng</span>
              <span className="text-xl font-extrabold text-white">{total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
