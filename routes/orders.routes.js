const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const order = OrderController;

router.get(`/`, order.GetOrders);
router.post('/', order.newOrder);
router.get(`/get/totalsales`, order.TotalSales);
router.get(`/get/count`, order.GetCountOrder);
router.get(`/get/userorders/:userid`, order.GetOrderUser);
router.get(`/:id`, order.GetOrderById);
router.put(`/:id`, order.UpdateOrder);
router.delete(`/:id`, order.RemoveOrder);

module.exports =router;