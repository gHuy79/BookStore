'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import {
  FaBookOpen,
  FaUserCircle,
  FaBars,
  FaMoon,
  FaSun,
  FaSearch,
  FaCog,
} from 'react-icons/fa';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); // NEW
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const auth = getAuth(app);

  // Check login + get role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(`/api/user-role?uid=${currentUser.uid}`);
          const data = await res.json();
          setRole(data.role); // "admin" | "user"
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b dark:border-gray-700">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-indigo-400 text-2xl font-extrabold"
      >
        <FaBookOpen className="text-blue-600 dark:text-blue-300" />
        <span>BookStore</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center border rounded-lg px-2 py-1 dark:bg-gray-800">
        <input
          type="text"
          placeholder="Tìm sách..."
          className="outline-none px-2 py-1 bg-transparent text-sm text-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button aria-label="Tìm kiếm" type="submit" className="text-gray-500 hover:text-blue-600 dark:text-gray-300">
          <FaSearch />
        </button>
      </form>

      {/* Navigation */}
      <nav className="space-x-4 hidden md:flex items-center">
        <Link href="/books" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 font-medium">Sách</Link>
        <Link href="/cart" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 font-medium">Giỏ hàng</Link>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-600 dark:text-yellow-300 hover:text-blue-600 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Auth */}
        {!user ? (
          <>
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Đăng nhập</Link>
            <Link href="/signup" className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">Đăng ký</Link>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600"
            >
              <FaUserCircle className="text-2xl" />
              <span className="hidden md:inline text-sm font-medium">
                {user.displayName || user.email}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50 animate-fade-in-up">
                {role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-b border-gray-200 dark:border-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaCog className="inline-block mr-2" />
                    Trang quản trị
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 text-sm rounded-b-xl"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-4">
        <button onClick={() => setDarkMode(!darkMode)} className="text-gray-700 dark:text-yellow-300 hover:text-blue-600">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button aria-label="Chuyển đổi" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
          <FaBars size={20} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 border-t px-6 py-4 flex flex-col gap-3 md:hidden z-40 shadow-md">
          <form onSubmit={handleSearch} className="flex items-center border rounded px-2 py-1 dark:bg-gray-800">
            <input
              type="text"
              placeholder="Tìm sách..."
              className="outline-none px-2 py-1 bg-transparent text-sm text-gray-700 dark:text-white w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button aria-label="Tìm kiếm" type="submit" className="text-gray-500 hover:text-blue-600 dark:text-gray-300">
              <FaSearch />
            </button>
          </form>

          <Link href="/books" className="text-gray-800 dark:text-gray-200 hover:text-blue-600">Sách</Link>
          <Link href="/cart" className="text-gray-800 dark:text-gray-200 hover:text-blue-600">Giỏ hàng</Link>

          {!user ? (
            <>
              <Link href="/login" className="text-blue-600 font-medium">Đăng nhập</Link>
              <Link href="/register" className="text-white bg-blue-600 px-4 py-2 rounded font-medium text-center">Đăng ký</Link>
            </>
          ) : (
            <>
              {role === 'admin' && (
                <Link href="/admin/dashboard" className="text-gray-800 dark:text-gray-200">Trang quản trị</Link>
              )}
              <Link href="/profile" className="text-gray-800 dark:text-gray-200">Tài khoản</Link>
              <button onClick={handleLogout} className="text-red-500 text-left">Đăng xuất</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
