const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentdate: { type: Date},
    description: { type: String},
    amount: { type: Number},
});

const schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'agencies' },
    pmediaroid: { type: mongoose.Schema.Types.ObjectId, ref: 'PMediaRO' },
    invoiceno: { type: Number },
    invoicedate: {
        type: Date,
        // required: true,
        validate: {
            validator: function (value) {
                return !isNaN(new Date(value).getTime()); // Check if the date is valid
            },
            message: 'Invalid RO date',
        },
    },
    billclientid: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    discountpercent: { type: Number },
    discountamount: { type: Number },
    taxableamount: { type: Number },
    invoicegstid: { type: mongoose.Schema.Types.ObjectId, ref: 'gst' }, // Reference to Gst model
    icgstamount: { type: Number, default: 0 },
    icgstpercent: { type: Number, default: 0 }, // CGST percentage
    isgstamount: { type: Number, default: 0 },
    isgstpercent: { type: Number, default: 0 }, 
    iigstpercent: { type: Number, default: 0 }, // CGST percentage
    iigstamount: { type: Number, default: 0 },
    invoiceamount: { type: Number },
    advance: { type: Number },
    payments: [paymentSchema],
});

module.exports = mongoose.model('PMediaROInvoice', schema);