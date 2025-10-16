const express = require('express');
const router = express.Router();
const linhaController = require('../controllers/linhaController');

router.post('/cadastro', linhaController.createLinha);
router.get('/', linhaController.getLinhas);
router.get('/:id', linhaController.getLinhaById);

module.exports = router;
