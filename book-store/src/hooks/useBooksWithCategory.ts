import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Book, Category } from '@/types/book';

export function useBooksWithCategory() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooksAndCategories() {
      try {
        setLoading(true);

        // Fetch books và categories song song
        const [bookSnap, categorySnap] = await Promise.all([
          getDocs(collection(db, 'books')),
          getDocs(collection(db, 'categories')),
        ]);

        // Lấy danh sách categories
        const categoryList: Category[] = categorySnap.docs.map((doc) => {
          const { name, description } = doc.data();
          return {
            id: doc.id,
            name,
            description,
          };
        });

        // Log categories
        console.log('✅ Categories:', categoryList);

        // Lấy danh sách books (không cần mapping categoryName nữa)
        const bookList: Book[] = bookSnap.docs.map((doc) => {
          const data = doc.data();

          console.log('📕 Book Raw Data:', data); // Log từng quyển sách

          return {
            id: doc.id,
            title: data.title,
            author: data.author,
            categoryID: data.categoryID,
            categoryName: data.categoryName || 'Không rõ', // Dùng trực tiếp categoryName từ Firebase
            price: data.price,
            description: data.description,
            coverImage: data.coverImage,
          };
        });

        // Log books
        console.log('✅ Books:', bookList);

        setBooks(bookList);
        setCategories(categoryList);
      } catch (error) {
        console.error('❌ Lỗi khi fetch dữ liệu từ Firestore:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooksAndCategories();
  }, []);

  return { books, categories, loading };
}
