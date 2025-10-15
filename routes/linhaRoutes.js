const express = require('express');
const router = express.Router();
const linhaController = require('../controllers/linhaController');

router.post('/cadastro', linhaController.createLinha);

module.exports = router;
