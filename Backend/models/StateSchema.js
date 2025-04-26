const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true }
});

let State = mongoose.model("state", schema);
module.exports = State;