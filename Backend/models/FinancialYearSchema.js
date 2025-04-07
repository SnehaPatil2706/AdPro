const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true }

});

let FinancialYear = mongoose.model("financialyears", schema);
module.exports = FinancialYear;