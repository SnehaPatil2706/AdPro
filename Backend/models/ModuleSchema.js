const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true }
});

let Module = mongoose.model("modules", schema);
module.exports = Module;