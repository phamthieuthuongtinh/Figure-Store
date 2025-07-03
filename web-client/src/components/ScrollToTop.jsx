// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn về đầu trang khi pathname thay đổi
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null; // Không render gì cả
}
