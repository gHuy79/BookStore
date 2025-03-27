'use client';

import { useBooks } from '../../hooks/useBooks';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const { books, loading } = useBooks();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">📚 Sách mới nhất</h1>

      {loading ? (
        <p>Đang tải sách...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              <Image
                src={book.image}
                alt={book.title}
                width={200}
                height={300}
                className="w-full h-60 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold text-indigo-800">{book.title}</h3>
              <p className="text-sm text-gray-500">{book.author}</p>
              <p className="text-sm font-bold text-rose-500 mt-1">
                {book.price.toLocaleString()}₫
              </p>
              <Link href={`/books/${book.id}`}>
                <button className="mt-3 w-full py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                  Xem chi tiết
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
