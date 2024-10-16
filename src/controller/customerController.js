const xlsx = require('xlsx');
const fs = require('fs');
const Customer = require('../models/customerModel');

const hello = (req, res) => {
    res.status(200).json('customerController is working fine');
};

exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.uploadCustomers = async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        console.log("Workbook read:", workbook);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log("Data extracted from Excel file:", data);

        const formattedData = data.map(item => ({
            name: item.Name,
            address1: item.Address1,
            state: item.State,
            district: item.District,
            pin_code: item["PIN Code"],
            contact_person: item["Contact Person"],
            mobile_no: item["Mobile No."],
            email: item.Email,
            credit_limit: item["Credit Limit Amount"],
            type_of_customer: item["Type Of Customer"],
            gstin: item["GSTIN/UIN"],
        }));

        const validData = formattedData.filter(item =>
            item.name && item.address1 && item.state && item.district && item.pin_code
        );

        // Define an array to hold error messages for duplicates
        const existingCustomers = [];

        for (const customer of validData) {
            const existingCustomer = await Customer.findOne({
                $or: [{ mobile_no: customer.mobile_no }, { email: customer.email }]
            });

            if (existingCustomer) {
                existingCustomers.push({
                    mobile_no: customer.mobile_no,
                    email: customer.email,
                });
            }
        }

        // If any duplicates are found, return a response with the duplicates
        if (existingCustomers.length > 0) {
            return res.status(409).json({
                message: "Duplicate customer data found.",
                duplicates: existingCustomers
            });
        }

        // Insert valid customers if no duplicates found
        const customers = await Customer.insertMany(validData);
        res.status(201).json(customers);

        // Delete the uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting the file:", err);
        });
    } catch (error) {
        console.error("Error during upload:", error); // Log the error
        res.status(400).json({ message: error.message });
    }
};
exports.hello = hello;