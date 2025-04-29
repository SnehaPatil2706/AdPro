const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    name: { type: String },
    contact: { type: Number },
    address: { type: String },
    stateid: { type: mongoose.Schema.Types.ObjectId, ref: "states" },
    gstno: { type: Number },

});

let PMedia = mongoose.model("pmedias", schema);
module.exports = PMedia;