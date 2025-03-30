'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const snapshot = await getDocs(collection(db, 'books'));
      const bookList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(bookList);
      setLoading(false);
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Sách</h1>

      {loading ? (
        <p>Đang tải sách...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left text-sm">
            <thead className="bg-gray-200 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2">Tên sách</th>
                <th className="px-4 py-2">Tác giả</th>
                <th className="px-4 py-2">Giá</th>
                <th className="px-4 py-2">Danh mục</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.price.toLocaleString()} đ</td>
                  <td className="px-4 py-2">{book.category}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="bg-yellow-400 text-white px-3 py-1 rounded">Sửa</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
