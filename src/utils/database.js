const mongoose = require('mongoose');
const config = require('../../config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('customer service : MongoDB connected...');
    } catch (error) {
        console.error("Unable to connect to mongodb from customer service  :  "+error.message);
        process.exit(1);
    }
};

module.exports = connectDB;