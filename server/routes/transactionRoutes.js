const express = require('express');
const { getTransactions, addTransaction } = require('../controllers/transactionController');
const router = express.Router();

router.post('/get-transaction', getTransactions);
router.post('/add-transaction', addTransaction);

module.exports = router;