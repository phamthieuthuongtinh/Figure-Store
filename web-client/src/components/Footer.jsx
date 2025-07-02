import React from 'react';
import ContactInfo from './ContactInfo';

function Footer() {
  return (
    <div>
      <ContactInfo />
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2025 ToyVerse Of TinhPham. All rights reserved.
      </footer>
    </div>
  );
}

export default Footer;
