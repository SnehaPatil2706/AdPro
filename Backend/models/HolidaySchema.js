const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    hdate: { type: Date, required: true },
    reason: { type: String, required: true },
    every_year: { type: Boolean, required: true },

});

let Holiday = mongoose.model("holidays", schema);
module.exports = Holiday;