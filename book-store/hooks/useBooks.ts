// hooks/useBooks.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Book = {
  id: string;
  title: string;
  author: string;
  categoryID: string;
  description: string;
  image: string;
  price: number;
};

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const querySnapshot = await getDocs(collection(db, "books"));
      const fetchedBooks: Book[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBooks.push({ id: doc.id, ...doc.data() } as Book);
      });
      setBooks(fetchedBooks);
      setLoading(false);
    }

    fetchBooks();
  }, []);

  return { books, loading };
}
