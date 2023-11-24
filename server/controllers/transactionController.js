const transectionModel = require('../models/transactionModel');
const moment = require('moment');

const getTransactions = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body;
        const transections = await transectionModel.find({
            ...(frequency !== "custom"
                ? {
                    date: {
                        $gt: moment().subtract(Number(frequency), "d").toDate(),
                    },
                }
                : {
                    date: {
                        $gte: selectedDate[0],
                        $lte: selectedDate[1],
                    },
                }),
            userid: req.body.userid,
            ...(type !== "all" && { type }),
        });
        res.status(200).json(transections);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const addTransaction = async (req, res) => {
    try {
        // const newTransection = new transectionModel(req.body);
        const newTransection = new transectionModel(req.body);
        await newTransection.save();
        res.status(201).send("Transection Created");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const editTransection = async (req, res) => {
    try {
        const transacationId = req.params.id;
        const newData = await transectionModel.findByIdAndUpdate(transacationId, req.body.payload, { new: true });
        // await transectionModel.findOneAndUpdate(
        //     { _id: req.body.transacationId },
        //     req.body.payload
        // );
        res.status(200).send({ data: newData, message: 'Transection updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const deleteTransection = async (req, res) => {
    try {
        const transacationId = req.params.id;
        // await transectionModel.findOneAndDelete({ _id: req.body.transacationId });
        await transectionModel.findOneAndDelete(transacationId);
        res.status(200).send("Transaction Deleted!");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
module.exports = {
    getTransactions,
    addTransaction,
    editTransection,
    deleteTransection
}