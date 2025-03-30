// app/layout.tsx
import './globals.css';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'Thư viện Sách',
  description: 'Website sách bằng Tiếng Việt',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gradient-to-br from-white to-indigo-50 min-h-screen`}>
        <Header />

        {/* 👇 Áp dụng padding và căn giữa toàn site */}
        <main className='bg-gradient-to-br from-white'>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
