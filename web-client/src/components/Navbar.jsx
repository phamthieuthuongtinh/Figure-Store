// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiShoppingCart,
  FiChevronDown,
  FiSearch,
  FiBookOpen,
} from 'react-icons/fi';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">ToyVerse</div>

        {/* Tìm kiếm */}
        <div className="flex-1 mx-6 max-w-md relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="w-full border rounded-full px-4 py-2 pl-10"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <a
            href="/"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiHome /> Trang chủ
          </a>

          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-500">
              <FiShoppingBag />
              Sản phẩm <FiChevronDown />
            </button>

            <div className="absolute top-full left-0 bg-white shadow rounded w-40 z-50 hidden group-hover:block">
              <a
                href="/products/figures"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Mô hình
              </a>
              <a
                href="/products/gundam"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Gundam
              </a>
              <a
                href="/products/teddy"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Gấu bông
              </a>
              <a
                href="/products/lego"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                LEGO
              </a>
            </div>
          </div>

          <a
            href="/blog"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiBookOpen /> Blog
          </a>

          <a
            href="/favorites"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiHeart /> Yêu thích
          </a>

          <a
            href="/login"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiUser /> Đăng nhập
          </a>
          <a
            href="/cart"
            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-700"
          >
            <FiShoppingCart /> Giỏ hàng
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
