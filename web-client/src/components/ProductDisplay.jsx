import ProductCard from './ProductCard';
import FlashSaleItem from './FlashSaleItem';

const ProductDisplay = ({ product }) => {
  return product.isOnSale ? (
    <FlashSaleItem item={product} />
  ) : (
    <ProductCard product={product} />
  );
};

export default ProductDisplay;
