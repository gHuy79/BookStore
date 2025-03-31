'use client';

import { Book } from '@/types/book';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BookPageProps {
  params: { slug: string };
}

export default function BookDetailPage({ params }: BookPageProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDescPopup, setShowDescPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'books', params.slug);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setBook(null);
        setLoading(false);
        return;
      }

      const data = docSnap.data() as Book;
      setBook(data);
      setLoading(false);
    };

    fetchData();
  }, [params.slug]);

  // Disable scroll khi popup mở
  useEffect(() => {
    if (showDescPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showDescPopup]);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Đang tải...</p>;
  }

  if (!book) {
    return notFound();
  }

  const maxDescLength = 300;
  const isLongDesc = book.description.length > maxDescLength;
  const descToShow =
    book.description.slice(0, maxDescLength) + (isLongDesc ? '...' : '');

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Hình ảnh sách */}
        <div className="w-full rounded-xl shadow-lg overflow-hidden">
          <Image
            src={book.coverImage}
            alt={book.title}
            width={500}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Thông tin sách */}
        <div className="space-y-6 max-w-3xl">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">{book.title}</h1>
            <p className="text-gray-600 mt-1 text-base">✍️ Tác giả: {book.author}</p>
          </div>

          {/* Thể loại + Giá */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              📚 Thể loại: {book.categoryName}
            </span>
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full font-semibold">
              💰 {book.price.toLocaleString()}₫
            </span>
          </div>

          {/* Mô tả */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">📖 Mô tả</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{descToShow}</p>
            {isLongDesc && (
              <button
                onClick={() => setShowDescPopup(true)}
                className="mt-2 text-sm text-indigo-600 hover:underline"
              >
                Xem thêm ▼
              </button>
            )}
          </div>

          {/* Nút hành động */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition">
              🛒 Thêm vào giỏ hàng
            </button>
            <Link href="/books">
              <button className="flex-1 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition">
                ← Quay lại danh sách
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* === POPUP MÔ TẢ CHI TIẾT === */}
      {showDescPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative animate-slideUp">
            <button
              onClick={() => setShowDescPopup(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📖 Mô tả chi tiết</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>
      )}

      {/* TAILWIND ANIMATIONS */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
