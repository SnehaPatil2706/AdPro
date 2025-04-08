const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    title: { type: String },
    cgstpercent: { type: Number },
    sgstpercent: { type: Number },
    igstpercent: { type: Number },
    gstcode: { type: String },

});

let GST = mongoose.model("gsts", schema);
module.exports = GST;