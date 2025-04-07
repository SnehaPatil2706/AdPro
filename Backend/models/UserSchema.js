const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    agencyid: { type: mongoose.Schema.Types.ObjectId, ref: "agencies", required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdon: { type: Date, default: Date.now },
    roleid: { type: mongoose.Schema.Types.ObjectId, ref: "roles", required: true }

});

let User = mongoose.model("users", schema);
module.exports = User;