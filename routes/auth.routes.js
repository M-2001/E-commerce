const express = require('express');
const AuthController = require('../controllers/auth.controller');

const auth = AuthController;

const router = express.Router();

router.post(`/login`, auth.Login);


module.exports = router;