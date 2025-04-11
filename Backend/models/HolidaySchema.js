const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    hdate: { type: Date },
    reason: { type: String },
    every_year: { type: Boolean },

});

let Holiday = mongoose.model("holidays", schema);
module.exports = Holiday;