const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true },
    isparent: { type: Boolean, required: true },
    parentid: { type: Number, required: true },
    srno: { type: Number, required: true },

});

let Menu = mongoose.model("menus", schema);
module.exports = Menu;