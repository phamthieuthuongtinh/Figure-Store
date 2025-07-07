const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
router.post('/vnpay', verifyToken, paymentController.createVnpayPayment);
router.get('/vnpay-return', paymentController.vnpayReturn);
module.exports = router;
