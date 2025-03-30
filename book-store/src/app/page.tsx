'use client';

import { useBooks } from '../../hooks/useBooks';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { books, loading } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sách theo từ khóa tìm kiếm
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy tối đa 8 quyển sách đầu tiên
  const newestBooks = filteredBooks.slice(0, 8);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen">
      
      {/* HERO */}
      <section className="text-center py-10 bg-indigo-100 rounded-3xl mb-10 shadow-inner">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 animate-pulse">
          📚 Khám phá Thư viện Sách Đỉnh Cao
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Nơi bạn tìm thấy tri thức, cảm hứng và cả sự thư giãn.
        </p>
        <a
          href="#book-list"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-700 transition"
        >
          Bắt đầu ngay 🚀
        </a>
      </section>

      {/* TÌM KIẾM */}
      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* SÁCH MỚI NHẤT */}
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">📕 Sách mới nhất</h2>

      {loading ? (
        <p className="text-center">Đang tải sách...</p>
      ) : newestBooks.length === 0 ? (
        <p className="text-center text-gray-500">Không tìm thấy sách phù hợp.</p>
      ) : (
        <div id="book-list" className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newestBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <Image
                src={book.coverImage}
                alt={book.title}
                width={200}
                height={300}
                className="w-full h-60 object-cover rounded-t-xl"
              />
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-base font-semibold text-indigo-800 line-clamp-2 h-[3rem]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-sm font-bold text-rose-600 mt-1">
                  {book.price.toLocaleString()}₫
                </p>
                <div className="mt-auto pt-3">
                  <Link href={`/books/${book.id}`}>
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition">
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ƯU ĐÃI */}
      <section className="mt-20 text-center bg-yellow-50 p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-600 mb-4">
          🎁 Ưu đãi cực sốc tháng này!
        </h2>
        <p className="text-gray-700 mb-6">
          Mua 2 cuốn bất kỳ, tặng 1 bookmark handmade cực xinh ❤️
        </p>
        <Link href="/books">
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition">
            Xem ưu đãi ngay
          </button>
        </Link>
      </section>

      {/* LỢI ÍCH */}
      <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">🌟 Tại sao chọn chúng tôi?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-gray-600 mt-6">
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Miễn phí vận chuyển</h3>
            <p>Giao hàng toàn quốc với đơn hàng từ 500.000₫.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Sách chính hãng</h3>
            <p>Cam kết 100% sách thật, chất lượng in ấn đảm bảo.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Đổi trả dễ dàng</h3>
            <p>Hỗ trợ đổi trả trong vòng 7 ngày nếu có lỗi in ấn.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
