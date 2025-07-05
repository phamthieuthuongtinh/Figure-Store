const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken); // tất cả route dưới đều cần token

router.get('/my', verifyToken, cartController.getMyCart);
router.post('/items', verifyToken, cartController.addItem);
router.patch('/items/:id', verifyToken, cartController.updateItemQty);
router.delete('/items/:id', verifyToken, cartController.deleteItem);
router.post('/sync', verifyToken, cartController.syncCart);
module.exports = router;
