const express = require('express');
const connectDB = require('./utils/database');
const customerRoutes = require('./routes/customerRoutes');
const config = require('../config/config');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/customers', customerRoutes);

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});