import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Typography, Button, Divider } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './Sidebar.css';

const { Text } = Typography;

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3 style={{ color: 'black' }}>ToyVerse Admin</h3>
      </div>

      <ul className="menu">
        <li className={location.pathname === '/users' ? 'active' : ''}>
          <Link to="/users">Quản lý người dùng</Link>
        </li>
        <li className={location.pathname === '/products' ? 'active' : ''}>
          <Link to="/products">Quản lý sản phẩm</Link>
        </li>
        <li className={location.pathname === '/categories' ? 'active' : ''}>
          <Link to="/categories">Quản lý loại</Link>
        </li>
        <li className={location.pathname === '/brands' ? 'active' : ''}>
          <Link to="/brands">Quản lý thương hiệu</Link>
        </li>
        <li className={location.pathname === '/orders' ? 'active' : ''}>
          <Link to="/orders">Quản lý đơn hàng</Link>
        </li>
        <li className={location.pathname === '/coupons' ? 'active' : ''}>
          <Link to="/coupons">Quản lý Coupon</Link>
        </li>
      </ul>

      <Divider />

      <div className="user-info">
        <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
        <div>
          <Text strong>{user?.name || 'Admin'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '0.85rem' }}>
            {user?.email}
          </Text>
        </div>
      </div>

      <Button
        icon={<LogoutOutlined />}
        type="primary"
        danger
        block
        style={{ marginTop: 16 }}
        onClick={handleLogout}
      >
        Đăng xuất
      </Button>
    </div>
  );
}

export default Sidebar;
