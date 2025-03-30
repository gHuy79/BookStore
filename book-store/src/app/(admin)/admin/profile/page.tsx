'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const [adminInfo, setAdminInfo] = useState<{ name: string; email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role !== 'admin') {
          router.push('/');
          return;
        }

        setAdminInfo({
          name: data.name || user.displayName || 'Admin',
          email: user.email || '',
          role: data.role || '',
        });
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  if (!adminInfo) {
    return <p className="text-gray-500">Đang tải thông tin...</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Thông tin tài khoản</h2>
      <div className="space-y-3 text-gray-700">
        <p><strong>👤 Tên:</strong> {adminInfo.name}</p>
        <p><strong>📧 Email:</strong> {adminInfo.email}</p>
        <p><strong>🔐 Quyền:</strong> {adminInfo.role}</p>
      </div>
    </div>
  );
}
