'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
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
        setUserData(docSnap.data() as UserData); // Ép kiểu về UserData
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-10"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Thông tin cá nhân</h1>

        <div className="space-y-4 text-gray-700 text-lg">
          <p><strong>👤 Họ và tên:</strong> {userData?.name}</p>
          <p><strong>📧 Email:</strong> {auth.currentUser?.email}</p>
          <p><strong>📱 Số điện thoại:</strong> {userData?.phone}</p>
          <p><strong>🏠 Địa chỉ:</strong> {userData?.address}</p>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
            onClick={() => router.push('/profile/edit')}
          >
            ✏️ Chỉnh sửa
          </button>
          <button
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            onClick={handleLogout}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </motion.div>
    </div>
  );
}
