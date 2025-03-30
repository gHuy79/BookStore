import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaBookOpen } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-blue-100 via-white to-white border-t py-10 px-4 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700 text-sm">

        {/* Cột 1: Logo & mô tả */}
        <div>
          <div className="flex items-center text-blue-600 text-2xl font-bold mb-3">
            <FaBookOpen className="mr-2" />
            <span>BookStore</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Khám phá kho tàng tri thức với hàng ngàn đầu sách hay từ khắp mọi nơi. Hành trình học hỏi bắt đầu từ đây!
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-blue-500">Khám phá</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-600 transition">🏠 Trang chủ</Link></li>
            <li><Link href="/books" className="hover:text-blue-600 transition">📚 Tất cả sách</Link></li>
            <li><Link href="/cart" className="hover:text-blue-600 transition">🛒 Giỏ hàng</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition">📞 Liên hệ</Link></li>
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-blue-500">Liên hệ</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" /> 0123 456 789
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-500" /> hello@bookstore.vn
            </li>
            <li>
              Địa chỉ: 123 Đường Sách, Quận 1, TP.HCM
            </li>
          </ul>
        </div>

        {/* Cột 4: Mạng xã hội */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-blue-500">Kết nối với chúng tôi</h4>
          <div className="flex gap-4 text-blue-600 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Theo dõi để nhận thông tin khuyến mãi, sách mới và ưu đãi đặc biệt mỗi tuần.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-xs mt-10 border-t pt-4">
        © 2025 <span className="font-semibold text-blue-500">BookStore</span>. All rights reserved.
      </div>
    </footer>
  );
}
