import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import ProductHighlight from '../components/ProductHighlight';
import ContactInfo from '../components/ContactInfo';
import Footer from '../components/Footer';
import CategoryHighlight from '../components/CategoryHighlight';
import WhyChooseMe from '../components/WhyChooseMe';
import FlashSale from '../components/Flashsale';
import NewsAndSocial from '../components/NewsAndSocial';

function Home() {
  return (
    <div className="font-sans">
      <div className="max-w-full mx-auto px-4">
        <Banner />
        <FlashSale />
        <ProductHighlight />
        <CategoryHighlight />
      </div>
      <NewsAndSocial />
      <WhyChooseMe />
      <ContactInfo />
    </div>
  );
}

export default Home;
