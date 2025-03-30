import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase"; // ✅ Import db từ firebase
import { Book } from "@/types/book"; // ✅ Import kiểu Book từ file types

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const booksQuery = query(collection(db, "books"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(booksQuery);
      const fetchedBooks: Book[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedBooks.push({
          id: doc.id,
          title: data.title || "Không có tiêu đề",
          author: data.author || "Không rõ tác giả",
          categoryID: data.categoryID || "",
          categoryName: data.categoryName || "Chưa phân loại",
          price: data.price || 0,
          description: data.description || "",
          coverImage: data.coverImage || "/default-book-cover.jpg", // 🔥 Dùng coverImage thay vì image
        });
      });

      setBooks(fetchedBooks);
      setLoading(false);
    }

    fetchBooks();
  }, []);

  return { books, loading };
}
