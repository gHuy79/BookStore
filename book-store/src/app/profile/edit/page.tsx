'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  phone: string;
  address: string;
}

export default function EditProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      });
      
      router.push('/profile'); // Quay về trang profile sau khi cập nhật
    } catch {
      setError('Lỗi khi cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-10"
      >
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
          Chỉnh sửa thông tin cá nhân
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên" 
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Số điện thoại</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại" 
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Địa chỉ</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ" 
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-800"
            >
              ⬅ Quay lại
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
