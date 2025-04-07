const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    roleid: { type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: true },
    moduleid: { type: mongoose.Schema.Types.ObjectId, ref: 'modules', required: true }
});

let RoleModule = mongoose.model("rolemodules", schema);
module.exports = RoleModule;