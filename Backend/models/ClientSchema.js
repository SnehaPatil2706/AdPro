const mongoose = require('mongoose');

let clientSchema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
    name: { type: String },
    contact: { type: Number },
    address: { type: String },
    stateid: { type: mongoose.Schema.Types.ObjectId, ref: 'state' },
    gstno: { type: String }
});

let Client = mongoose.model("Client", clientSchema);
module.exports = Client;
