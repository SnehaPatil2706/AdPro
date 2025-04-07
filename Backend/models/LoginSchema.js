const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    username:'sneha',
    password:'patil'
});

let Login = mongoose.model("login",schema);
module.exports = Login;