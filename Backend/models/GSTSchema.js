const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies", required: true },
    title: { type: String, required: true },
    cgstpercent: { type: Number, required: true },
    sgstpercent: { type: Number, required: true },
    igstpercent: { type: Number, required: true },
    gstcode: { type: String, required: true },

});

let GST = mongoose.model("gsts", schema);
module.exports = GST;