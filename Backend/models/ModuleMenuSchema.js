const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    moduleid: { type: mongoose.Schema.Types.ObjectId, ref: 'modules', required: true },
    menuid: { type: mongoose.Schema.Types.ObjectId, ref: 'menus', required: true },

});

let ModuleMenu = mongoose.model("modulemenus", schema);
module.exports = ModuleMenu;