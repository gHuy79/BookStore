// app/layout.tsx
import './globals.css';
import Header from '../../components/Header/page';
import Footer from '../../components/Footer/page';
import { ReactNode } from 'react';  

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-800">
        <Header />
        <div className="min-h-screen container mx-auto">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
