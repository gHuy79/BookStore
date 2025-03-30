'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agree) {
      setError('Vui lòng đồng ý với điều khoản sử dụng.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
      {/* 🔮 Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 bg-200% animate-gradient-x z-0" />

      {/* 🌟 Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl p-10 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-6">
          Tạo tài khoản mới
        </h1>

        {error && (
          <p className="text-center text-red-600 font-medium mb-4">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="0123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              placeholder="123 Đường ABC, Quận 1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700 mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
              className="mt-1"
            />
            <span>
              Tôi đồng ý với{' '}
              <a
                href="/terms"
                className="text-blue-600 hover:underline font-medium"
              >
                điều khoản sử dụng
              </a>
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
