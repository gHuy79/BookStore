'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import clsx from 'clsx';
import { FaChevronUp } from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Sách', path: '/admin/books' },
  { name: 'Danh mục', path: '/admin/categories' },
  { name: 'Đơn hàng', path: '/admin/order' },
  { name: 'Người dùng', path: '/admin/users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const data = userDoc.data();

      if (!userDoc.exists() || data?.role !== 'admin') {
        router.push('/');
        return;
      }

      setAdminInfo({
        name: data?.name || user.displayName || 'Admin',
        email: user.email || '',
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Click outside to close dropup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'block py-2 px-4 rounded hover:bg-blue-700',
                  pathname.startsWith(item.path) && 'bg-blue-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Admin Info dropup */}
        <div className="relative mt-6 border-t border-blue-700 pt-4 text-sm" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex items-center justify-between w-full hover:text-blue-300"
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center font-bold">
                {adminInfo?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span>{adminInfo?.name || 'Admin'}</span>
            </div>
            <FaChevronUp
              className={clsx(
                'transition-transform duration-300',
                showMenu ? 'rotate-180' : 'rotate-0'
              )}
            />
          </button>

          {/* Dropup menu */}
          <div
            className={clsx(
              'absolute left-0 bottom-12 bg-blue-800 rounded shadow-lg z-10 overflow-hidden transition-all duration-300',
              showMenu
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
            )}
          >
            <Link
              href="/admin/profile"
              className="block px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => setShowMenu(false)}
            >
              📄 Thông tin cá nhân
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setShowMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-white hover:bg-red-600"
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
}
