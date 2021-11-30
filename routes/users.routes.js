const express = require('express');
const UserController = require('../controllers/user.controller');

const user = UserController;

const router = express.Router();

router.get(`/`, user.GetUser);
router.get('/get/count', user.GetCountUsers);
router.post(`/`, user.RegisterUser);
router.get(`/:id`, user.GetUserByID);
router.delete(`/:id`, user.RemoveUser);


module.exports = router;