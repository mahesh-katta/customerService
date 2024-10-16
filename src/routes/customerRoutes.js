const express = require('express');
const multer = require('multer');
const { createCustomer, hello, uploadCustomers } = require('../controller/customerController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Specify the destination for uploaded files

router.get('/', hello);
router.post('/', createCustomer);

// New route for uploading Excel file
router.post('/upload', upload.single('file'), uploadCustomers);

module.exports = router;