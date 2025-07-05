import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import ProductHighlight from '../components/ProductHighlight';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';
import CategoryHighlight from '../components/CategoryHighlight';
import WhyChooseMe from '../components/WhyChooseMe';
import FlashSale from '../components/Flashsale';
import NewsAndSocial from '../components/NewsAndSocial';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCart } from '../services/CartService';
import { setCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';

function Home() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetchMyCart();
        dispatch(setCartItems(res.data.data)); // <- đảm bảo đúng key: .data.data hoặc .data.items tuỳ backend
      } catch (err) {
        console.log('Lỗi khi lấy giỏ hàng:', err);
        toast.error('Không lấy được giỏ hàng');
      }
    })();
  }, [user, dispatch]);
  return (
    <div className=" font-sans">
      <div className="max-w-full mx-auto px-4">
        <Banner />
        <FlashSale />
        <ProductHighlight />
        <CategoryHighlight />
      </div>
      <NewsAndSocial />
      <WhyChooseMe />
    </div>
  );
}

export default Home;
