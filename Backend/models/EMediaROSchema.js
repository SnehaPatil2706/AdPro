const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'Agencies' }, // Reference to Agency model
    rono: { type: Number },
    rodate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(new Date(value).getTime()); // Check if the date is valid
            },
            message: 'Invalid RO date',
        },
    },
    clientid: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Reference to Client model
    emediaid: { type: mongoose.Schema.Types.ObjectId, ref: 'EMedia' }, // Reference to EMedia model
    centers: { type: String }, 
    language: { type: String },
    caption: { type: String },
    noofrecords: { type: Number },
    totalspots: { type: Number },
    totalcharges: { type: Number },
    comissionpercent: { type: Number },
    comissionamount: { type: Number },
    chequeno: { type: String },
    chequedate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return !isNaN(new Date(value).getTime()); // Check if the date is valid
            },
            message: 'Invalid cheque date',
        },
    },
    bankname: { type: String },
    robillamount: { type: Number },
    instructions: { type: String },
    gstid: { type: mongoose.Schema.Types.ObjectId, ref: 'Gst' }, // Reference to Gst model
    cgstpercent: { type: Number, default: 0 }, // CGST percentage
    cgstamount: { type: Number, default: 0 }, 
    sgstpercent: { type: Number, default: 0 }, // CGST percentage
    sgstamount: { type: Number, default: 0 },
    igstpercent: { type: Number, default: 0 }, // CGST percentage
    igstamount: { type: Number, default: 0 },
    status: { type: String, }, // Status of
});

module.exports = mongoose.model('EMediaRO', schema);


// ccpercent
// ccamount
