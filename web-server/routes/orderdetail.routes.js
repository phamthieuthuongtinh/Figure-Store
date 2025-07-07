const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderdetail.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
router.get('/', orderDetailController.getAllOrderDetails);
router.get('/:id', orderDetailController.getOrderDetailById);
router.post('/', verifyToken, orderDetailController.createOrderDetail);
module.exports = router;
