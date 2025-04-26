const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    title: { type: String },
    description: { type: String },
    wdate: { type: Date },
    status: { type: String }
});

let WorkSchedule = mongoose.model("workschedules", schema);
module.exports = WorkSchedule;