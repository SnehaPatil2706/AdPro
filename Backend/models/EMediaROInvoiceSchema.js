const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentdate: { type: Date},
    description: { type: String},
    amount: { type: Number},
});

const schema = new mongoose.Schema({
    emediaroid: { type: mongoose.Schema.Types.ObjectId, ref: 'EMediaRO' },
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'Agencies' },
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
    icgstpercent: { type: Number, default: 0 },
    icgstamount: { type: Number, default: 0 },
    isgstpercent: { type: Number, default: 0 }, // CGST percentage
    isgstamount: { type: Number, default: 0 },
    iigstpercent: { type: Number, default: 0 }, // CGST percentage
    iigstamount: { type: Number, default: 0 },
    gstamount: { type: Number, default: 0 },
    invoiceamount: { type: Number },
    advance: { type: Number },
    icomissionpercent: { type: Number },
    icomissionamount: { type: Number },
    payments: [paymentSchema],
});

module.exports = mongoose.model('EMediaROInvoice', schema);