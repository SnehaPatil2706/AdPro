const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies", required: true },
    clientid: { type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true },
    pmediaid: { type: mongoose.Schema.Types.ObjectId, ref: "pmedia", required: true },
    adate: { type: Date, required: true },
    description: { type: String, required: true },
    pmediaroid: { type: mongoose.Schema.Types.ObjectId, ref: "pmediaros", required: true },
    beforeclientmessage: { type: String, required: true },
    beforeagencymessage: { type: String, required: true },
    ondateclientmessage: { type: String, required: true },
    ondateagencymessage: { type: String, required: true },

});

let AdSchedule = mongoose.model("adschedules", schema);
module.exports = AdSchedule;