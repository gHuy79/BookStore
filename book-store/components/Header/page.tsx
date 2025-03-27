// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        BookStore
      </Link>
      <nav className="space-x-4">
        <Link href="/books" className="hover:text-blue-600">Sách</Link>
        <Link href="/cart" className="hover:text-blue-600">Giỏ hàng</Link>
        <Link href="/login" className="hover:text-blue-600">Đăng nhập</Link>
      </nav>
    </header>
  );
}
