const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderdetail.controller');
// const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
router.get('/', orderDetailController.getAllOrderDetails);
router.get('/:id', orderDetailController.getOrderDetailById);
router.post('/', orderDetailController.createOrderDetail);
module.exports = router;
