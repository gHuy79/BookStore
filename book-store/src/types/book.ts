// BookStore/book-store/types/book.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    categoryID: string;
    categoryName: string;
    price: number;
    description: string;
    coverImage: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    description?: string;
  }
  