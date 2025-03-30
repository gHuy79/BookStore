'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle } from '@/lib/auth';
import { auth } from '@/lib/firebase';
// import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   if (!isMounted) return;
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     if (user) router.push('/');
  //   });
  //   return () => unsub();
  // }, [isMounted]);

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await loginWithEmail(email, password);
  //   } catch (err) {
  //     const error = err as FirebaseError;
  //     setError(error.message);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
  
      // Sau khi đăng nhập thành công
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
  
        router.push('/'); // hoặc '/admin'
      }
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };
  

  // const handleGoogle = async () => {
  //   try {
  //     await loginWithGoogle();
  //   } catch (err) {
  //     const error = err as FirebaseError;
  //     setError(error.message);
  //   }
  // };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
  
      // Sau khi đăng nhập thành công
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
  
        router.push('/');
      }
    } catch (err) {
      const error = err as FirebaseError;
      setError(error.message);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-pink-500 overflow-hidden">
      {/* Gradient moving background (optional animation) */}
      <div className="absolute inset-0 animate-gradient-x bg-[length:200%_200%] z-0" />

      {/* Animated Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-white/30"
      >
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          🔐 Đăng nhập BookStore
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:brightness-110 transition"
          >
            🚀 Đăng nhập
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-600">— hoặc —</p>

        <button
          onClick={handleGoogle}
          className="mt-4 w-full py-3 flex items-center justify-center border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <FaGoogle className="mr-2" /> Đăng nhập bằng Google
        </button>

        <div className="text-sm text-center mt-6">
          <p>
            Chưa có tài khoản?{' '}
            <a href="/signup" className="text-indigo-600 hover:underline font-medium">
              Đăng ký
            </a>
          </p>
          <p className="mt-1">
            <a href="/forgot-password" className="text-gray-500 hover:underline">
              Quên mật khẩu?
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
