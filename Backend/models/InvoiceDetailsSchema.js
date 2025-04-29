const mongoose = require('mongoose');

// Define the schema for Invoice Details
const invoiceDetailsSchema = new mongoose.Schema({
    invoiceid: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true }, // Reference to Invoice model
    srno: { type: Number, required: true }, // Serial number
    name: { type: String, required: true }, // Name of the item/service
    quantity: { type: Number, required: true }, // Quantity of the item/service
    amount: { type: Number, required: true }, // Rate or price of the item/service
    total: { 
        type: Number, 
        required: true,
        validate: {
            validator: function() {
                return this.total === this.quantity * this.amount;
            },
            message: 'Total must equal quantity multiplied by amount.'
        }
    } // Total amount (quantity * rate)
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export the InvoiceDetails model
let InvoiceDetails = mongoose.model("invoiceDetails", invoiceDetailsSchema);

module.exports = InvoiceDetails;