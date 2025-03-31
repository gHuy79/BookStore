import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface BookPageProps {
  params: { slug: string };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const slug = params.slug;

  // Lấy dữ liệu sách từ Firestore
  const docRef = doc(db, 'books', slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return notFound();

  const book = docSnap.data();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      {/* Tiêu đề */}
      <section className="text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700">{book.title}</h1>
        <p className="text-lg text-gray-500 mt-2">Tác giả: {book.author}</p>
      </section>

      {/* Nội dung */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Hình ảnh */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <Image
            src={book.coverImage}
            alt={book.title}
            width={500}
            height={700}
            className="w-full object-cover"
          />
        </div>

        {/* Thông tin sách */}
        <div className="space-y-6">
          <p className="text-sm italic text-gray-400">📂 Thể loại: {book.categoryName}</p>

          <p className="text-xl font-bold text-rose-600">
            💰 {book.price.toLocaleString()}₫
          </p>

          <p className="text-gray-700 leading-relaxed">{book.description}</p>

          {/* Nút hành động */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              🛒 Thêm vào giỏ hàng
            </button>

            <Link href="/books">
              <button className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                ← Quay lại danh sách
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
