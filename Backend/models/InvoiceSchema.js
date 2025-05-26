const mongoose = require('mongoose');
// const invoiceDetailsSchema = require('./InvoiceDetailsSchema'); // Import schema only
const Client = require('./ClientSchema'); // Import Client schema
const Agency = require('./AgencySchema'); // Import Agency schema

const paymentSchema = new mongoose.Schema({
    paymentDate: { type: Date},
    description: { type: String},
    amount: { type: Number},
});
// Define the schema for Invoice
const invoiceSchema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'Agencies', required: true }, // Reference to Agency model
    invoiceNo: { type: Number, required: true }, // Invoice number
    invoiceDate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(new Date(value).getTime()); // Check if the date is valid
            },
            message: 'Invalid invoice date',
        },
    },
    clientid: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // Reference to Client model
    amount: { type: Number, required: true }, // Total amount
    discount: { type: Number, default: 0 }, // Discount applied (default to 0)
    taxableAmount: { type: Number, required: true }, // Taxable amount
    cgstPercent: { type: Number, default: 0 }, // CGST percentage
    cgstAmount: { type: Number, default: 0 }, // CGST amount
    sgstPercent: { type: Number, default: 0 }, // SGST percentage
    sgstAmount: { type: Number, default: 0 }, // SGST amount
    igstPercent: { type: Number, default: 0 }, // IGST percentage
    igstAmount: { type: Number, default: 0 }, // IGST amount
    billAmount: { 
        type: Number, 
        required: true,
    }, // Total bill amount
    gstType: { type: String, required: true }, // GST type (CGST/SGST/IGST)
    details: [], // Embedded InvoiceDetailsSchema
    payments: [paymentSchema],
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export the Invoice model
module.exports = mongoose.model('Invoice', invoiceSchema);