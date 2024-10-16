const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address1: { type: String, required: true },
    state: { type: String },
    district: { type: String },
    pin_code: { type: String},
    contact_person: { type: String },
    mobile_no: { type: String,unique:false,required:false },
    email: { type: String, unique: false,required:false },
    credit_limit: { type: Number },
    type_of_customer: { type: String },
    gstin: { type: String },
    priority: { type: Number, default: 0, min: 0, max: 100 },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', CustomerSchema);