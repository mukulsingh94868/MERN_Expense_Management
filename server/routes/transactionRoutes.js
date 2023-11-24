const express = require('express');
const { getTransactions, addTransaction, editTransection, deleteTransection } = require('../controllers/transactionController');
const router = express.Router();

router.post('/get-transaction', getTransactions);
router.post('/add-transaction', addTransaction);
router.put("/edit-transection/:id", editTransection);
router.delete("/delete-transection/:id", deleteTransection);

module.exports = router;