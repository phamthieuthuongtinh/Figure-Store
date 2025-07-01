const express = require('express');
const router = express.Router();
// routes/web.js
router.use('/api/auth', require('./auth.routes'));
router.use('/api/products', require('./product.routes'));
router.use('/api/product-images', require('./productImage.routes'));
router.use('/api/categories', require('./category.routes'));
router.use('/api/brands', require('./brand.routes'));
router.use('/api/orders', require('./order.routes'));
router.use('/api/orderdetails', require('./orderdetail.routes'));
router.use('/api/coupons', require('./coupon.routes'));
router.use('/api/users', require('./user.routes'));
router.use('/api/sales', require('./sale.routes'));
router.use('/api/banners', require('./banner.routes'));
module.exports = router;
