const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true }
});

let State = mongoose.model("states", schema);
module.exports = State;