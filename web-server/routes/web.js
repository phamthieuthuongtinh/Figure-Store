const express = require('express');
const router = express.Router();
// routes/web.js
router.use('/api/auth', require('./auth.routes'));
router.use('/api/products', require('./product.routes'));
router.use('/api/categories', require('./category.routes'));
router.use('/api/brands', require('./brand.routes'));

module.exports = router;
