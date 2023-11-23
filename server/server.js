const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

const userRoute = require('./routes/userRoutes');
const transactionRoute = require('./routes/transactionRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world')
});

app.use('/api/v1/users', userRoute);
app.use('/api/v1/transactions', transactionRoute);

const PORT = 5000 || process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(() => {
    console.log('Database connection established');
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    })
}).catch((error) => {
    console.log('error', error.message);
})
