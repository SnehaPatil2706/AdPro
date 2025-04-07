const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true }
});

let Role = mongoose.model("roles", schema);
module.exports = Role;