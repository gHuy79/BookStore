'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle } from '../../../lib/auth';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false); // Thêm biến kiểm tra

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Chỉ chạy nếu đã mounted
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsub();
  }, [isMounted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };

  if (!isMounted) return null; // Fix hydration mismatch

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Đăng nhập vào BookStore
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">Hoặc đăng nhập bằng</p>

        <button
          onClick={handleGoogle}
          className="mt-3 w-full border border-gray-400 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition"
        >
          Đăng nhập với Google
        </button>

        <div className="text-sm text-center mt-6">
          <p>
            Chưa có tài khoản?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Đăng ký
            </a>
          </p>
          <p className="mt-1">
            <a href="/forgot-password" className="text-gray-500 hover:underline">
              Quên mật khẩu?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
