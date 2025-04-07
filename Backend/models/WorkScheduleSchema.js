const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies", required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    wdate: { type: Date, required: true },
    status: { type: String, required: true },

});

let WorkSchedule = mongoose.model("workschedules", schema);
module.exports = WorkSchedule;