const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    name: { type: String },
    contact: { type: Number },
    address: { type: String },
    stateid: { type: mongoose.Schema.Types.ObjectId, ref: "states" },
    gstno: { type: String },

});

// let EMedia = mongoose.model("emedias", schema);
let EMedia = mongoose.model("EMedia", schema);
module.exports = EMedia;