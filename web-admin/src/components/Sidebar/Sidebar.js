import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation(); // ✅ Thêm dòng này

  return (
    <div className="sidebar">
      <h3>Admin</h3>
      <ul className="menu">
        <li className={location.pathname === '/products' ? 'active' : ''}>
          <Link to="/products">Quản lý sản phẩm</Link>
        </li>
        <li className={location.pathname === '/categories' ? 'active' : ''}>
          <Link to="/categories">Quản lý loại</Link>
        </li>
        <li className={location.pathname === '/brands' ? 'active' : ''}>
          <Link to="/brands">Quản lý thương hiệu</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
