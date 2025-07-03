import React, { useEffect, useState } from 'react';
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
import { getAllCategories } from '../services/CategoryService';
import { Link } from 'react-router-dom'; // ✅ Thêm dòng này
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const count = useSelector((state) =>
    state.cart.items.reduce((s, i) => s + i.quantity, 0)
  );
  useEffect(() => {
    getAllCategories().then((res) => setCategories(res.data.data));
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ToyVerse
        </Link>

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
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiHome /> Trang chủ
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-500">
              <FiShoppingBag />
              Sản phẩm <FiChevronDown />
            </button>

            <div className="absolute top-full left-0 bg-white shadow rounded w-40 z-50 hidden group-hover:block">
              {categories.map((cate) => (
                <Link
                  key={cate.categoryId}
                  to={`/products/category/${cate.categoryId}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {cate.categoryName}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/blog"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiBookOpen /> Blog
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiHeart /> Yêu thích
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
          >
            <FiUser /> Đăng nhập
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-700 relative"
          >
            <FiShoppingCart></FiShoppingCart>{' '}
            {count > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                {count}
              </span>
            )}
            Giỏ hàng
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
