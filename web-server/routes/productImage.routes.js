const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/productImage.controller');

router.get('/:productId', productImageController.getProductImages);
router.post('/:productId', productImageController.addProductImageByUrl);
router.delete('/:id', productImageController.deleteProductImage);

module.exports = router;
