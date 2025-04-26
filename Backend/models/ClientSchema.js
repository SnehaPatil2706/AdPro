const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'agency' },
    name: { type: String },
    contact: { type: Number },
    address: { type: String },
    stateid: { type: mongoose.Schema.Types.ObjectId, ref: 'state' },
    gstno: { type: Number }
});

let Client = mongoose.model("clients", schema);
module.exports = Client;