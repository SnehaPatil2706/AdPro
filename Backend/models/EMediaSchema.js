const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies", required: true },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    address: { type: String, required: true },
    stateid: { type: mongoose.Schema.Types.ObjectId, ref: "states", required: true },
    gstno: { type: Number, required: true },

});

let EMedia = mongoose.model("emedias", schema);
module.exports = EMedia;