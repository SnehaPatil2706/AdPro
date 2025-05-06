const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agency" },
    title: { type: String },
    cgstpercent: { type: Number, set: v => parseFloat(v) },
    sgstpercent: { type: Number, set: v => parseFloat(v) },
    igstpercent: { type: Number, set: v => parseFloat(v) },
    gstcode: { type: String },

});

let GST = mongoose.model("gsts", schema);
module.exports = GST;