'use client';

import { useBooksWithCategory } from '../../../hooks/useBooksWithCategory';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BooksPage() {
  const { books, loading, categories } = useBooksWithCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [priceFilter, setPriceFilter] = useState('Tất cả');


  // Lọc sách theo tên và thể loại
  const filteredBooks = books.filter((book) => {
    const matchTitle = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === 'Tất cả' || book.categoryName === selectedCategory;
    let matchPrice = true;
    switch (priceFilter) {
      case 'Dưới 100.000₫':
        matchPrice = book.price < 100000;
        break;
      case '100.000₫ - 200.000₫':
        matchPrice = book.price >= 100000 && book.price <= 200000;
        break;
      case 'Trên 200.000₫':
        matchPrice = book.price > 200000;
        break;
      default:
        matchPrice = true;
      }
    return matchTitle && matchCategory && matchPrice;
  });


  // Debug log
  // console.log('🔍 searchTerm:', searchTerm);
  // console.log('📂 selectedCategory:', selectedCategory);
  // console.log('📚 Tất cả books:', books);
  // console.log('📑 Categories:', categories);
  // console.log('✅ filteredBooks:', filteredBooks);

  return (
    <div className="space-y-10">
      {/* TIÊU ĐỀ TRANG */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
          📖 Tất cả Sách
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Tìm kiếm và khám phá kho sách khổng lồ của chúng tôi
        </p>
      </section>

      {/* THANH TÌM KIẾM */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* FILTER THEO THỂ LOẠI */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory('Tất cả')}
          className={`px-4 py-2 rounded-full border text-sm font-medium ${
            selectedCategory === 'Tất cả'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full border text-sm font-medium ${
              selectedCategory === cat.name
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* BỘ LỌC GIÁ */}
      <div className="text-center space-y-2">
        <h2 className="text-base font-semibold text-gray-700">💰 Lọc theo giá</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {['Tất cả', 'Dưới 100.000₫', '100.000₫ - 200.000₫', 'Trên 200.000₫'].map((range) => (
            <button
              key={range}
              onClick={() => setPriceFilter(range)}
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                priceFilter === range
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH SÁCH */}
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center text-gray-400">Không tìm thấy sách nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <Image
                src={book.coverImage}
                alt={book.title}
                width={300}
                height={400}
                className="w-full h-60 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-base font-semibold text-indigo-800 line-clamp-2 h-[3rem]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-xs italic text-gray-400">{book.categoryName}</p>
                <p className="text-sm font-bold text-rose-600 mt-1">
                  {book.price.toLocaleString()}₫
                </p>
                <div className="pt-3">
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
    </div>
  );
}
