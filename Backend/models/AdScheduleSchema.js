const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies" },
    clientid: { type: mongoose.Schema.Types.ObjectId, ref: "clients" },
    pmediaid: { type: mongoose.Schema.Types.ObjectId, ref: "pmedia" },
    adate: { type: Date },
    description: { type: String },
    pmediaroid: { type: mongoose.Schema.Types.ObjectId, ref: "pmediaros" },
    beforeclientmessage: { type: Boolean, default: false},
    beforeagencymessage: { type: Boolean, default: false},
    ondateclientmessage: { type: Boolean, default: false},
    ondateagencymessage: { type: Boolean, default: false}
});

let AdSchedule = mongoose.model("adschedules", schema);
module.exports = AdSchedule;