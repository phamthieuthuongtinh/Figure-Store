const express = require('express');
const router = express.Router();

router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));

module.exports = router;
