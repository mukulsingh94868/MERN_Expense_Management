const transectionModel = require('../models/transactionModel');

const getTransactions = async (req, res) => {
    try {
        const newTransaction = await transectionModel.find({ userid: req.body.userid });
        res.status(200).json(newTransaction);
    } catch (error) {
        res.status(404).json({ success: false, error });
    }
};

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transectionModel(req.body);
        const savedTransaction = await newTransaction.save();
        res.status(200).send("Transation Created");
    } catch (error) {
        res.status(404).json({ success: false, error });
    }
};

module.exports = {
    getTransactions,
    addTransaction
}