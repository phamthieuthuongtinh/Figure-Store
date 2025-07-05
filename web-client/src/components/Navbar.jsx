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
  FiLogOut,
} from 'react-icons/fi';
import { getAllCategories } from '../services/CategoryService';
import { Link } from 'react-router-dom'; // ✅ Thêm dòng này
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { clearCart } from '../slices/cartSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const totalQty = useSelector((state) => state.cart.totalQty);
  const { user } = useSelector((state) => state.auth); // null nếu chưa đăng nhập
  const dispatch = useDispatch();
  // const count = useSelector((state) =>
  //   state.cart.items.reduce((s, i) => s + i.quantity, 0)
  // );
  useEffect(() => {
    getAllCategories().then((res) => setCategories(res.data.data));
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ToyVerse
          </Link>

          <div className="block w-full lg:w-[500px] xl:w-[600px] mx-0 lg:mx-8 mb-2 lg:mb-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                className="w-full border rounded-full pl-10 pr-4 py-2"
              />
            </div>
          </div>
          {/* hamburger – nhớ toggle state */}
          <button
            className="lg:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } absolute top-full left-0 right-0 bg-white border-t shadow-md
         lg:static lg:flex lg:items-center lg:gap-6 lg:shadow-none lg:border-0`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center w-full gap-4 p-4 lg:p-0 lg:gap-6">
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
              to="/blogs"
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
            {!user ? (
              /* --------- Chưa đăng nhập: nút đăng nhập ---------- */
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-500"
              >
                <FiUser /> Đăng nhập
              </Link>
            ) : (
              /* --------- Đã đăng nhập: icon + dropdown ---------- */
              <div className="relative group">
                {/* Icon user (có thể thay bằng avatar) */}
                <button className="flex items-center gap-1 text-gray-700 hover:text-blue-500">
                  <FiUser />
                  <span>{user.userName.split(' ')[0]}</span> {/* tên ngắn */}
                </button>

                {/* Dropdown xuất hiện khi hover (hoặc focus-within) */}
                <div
                  className="absolute left-0 mt-0 w-40 bg-white border rounded-lg shadow-lg opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible transition duration-150"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      dispatch(clearCart());
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    <FiLogOut /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
            <Link
              to="/cart"
              className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-700 relative"
            >
              <FiShoppingCart></FiShoppingCart>{' '}
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                  {totalQty}
                </span>
              )}
              Giỏ hàng
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
