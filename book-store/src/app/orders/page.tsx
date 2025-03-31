'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { getCartItems, clearCart } from '@/lib/cart';
import { CartItem, Order, ShippingAddress } from '@/types/order';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [receiver, setReceiver] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const user = getAuth().currentUser;
      if (!user) return;
      const items = await getCartItems(user.uid);
      setCartItems(items);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getAuth().currentUser;
    if (!user) {
      setError('Bạn cần đăng nhập để thanh toán.');
      return;
    }

    if (!address || !phone || !receiver) {
      setError('Vui lòng điền đầy đủ thông tin nhận hàng.');
      return;
    }

    const shippingAddress: ShippingAddress = {
      address,
      phone,
      receiver,
    };

    const order: Order = {
      userId: user.uid,
      items: cartItems,
      totalPrice,
      status: 'pending',
      shippingAddress,
    };

    try {
      await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: Timestamp.now(),
      });
      await clearCart(user.uid);
      router.push('/'); // Có thể đổi thành /orders nếu có trang đơn hàng
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi đặt hàng.');
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Đang tải giỏ hàng...</p>;

  if (cartItems.length === 0)
    return <p className="text-center py-10 text-gray-500">🛒 Giỏ hàng trống!</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">🧾 Thanh toán</h1>

      {/* Hiển thị giỏ hàng */}
      <div className="space-y-2 border-b pb-6">
        {cartItems.map((item) => (
          <div key={item.bookId} className="flex justify-between">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">SL: {item.quantity}</p>
            </div>
            <p>{(item.price * item.quantity).toLocaleString()}₫</p>
          </div>
        ))}
        <div className="text-right font-semibold pt-4">
          Tổng cộng: {totalPrice.toLocaleString()}₫
        </div>
      </div>

      {/* Form nhận hàng */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">📦 Thông tin nhận hàng</h2>

        <div>
          <label className="block mb-1 text-sm font-medium">Người nhận</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="0123456789"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Địa chỉ</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Số nhà, đường, phường, quận..."
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          ✅ Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}
