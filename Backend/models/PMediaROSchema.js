const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  srno: { type: Number },
  date: { type: Date },
  caption: { type: String },
  position: { type: String },
  hue: { type: String },
  size: {
    width: { type: Number },
    height: { type: Number }
  },
  area: { type: Number },
  paidBonus: { type: String },
  rate: { type: Number },
  charges: { type: Number },
  commissionpercent: { type: Number, default: 0 },
  commissionamount: { type: Number, default: 0 },
  cgstpercent: { type: Number, default: 0 },
  cgstamount: { type: Number, default: 0 },
  sgstpercent: { type: Number, default: 0 },
  sgstamount: { type: Number, default: 0 },
  igstpercent: { type: Number, default: 0 },
  igstamount: { type: Number, default: 0 },
  gsttotal: { type: Number, default: 0 },
  totalcharges: { type: Number, default: 0 },
  chequeno: { type: String },
  chequedate: { type: Date }
});

const Schema = new mongoose.Schema({
  agencyid: { type: mongoose.Schema.Types.ObjectId, ref: 'agencies', required: true },
  rono: {
    type: Number,
    required: true,
    unique: true
  },

  rodate: { type: Date },
  mediabillno: { type: String },
  mediabillamount: { type: Number },
  clientid: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  pmediaid: { type: mongoose.Schema.Types.ObjectId, ref: 'pmedias' },
  editions: { type: String },
  items: [itemSchema],
  bankname: { type: String },
  robillamount: { type: Number },
  instructions: { type: String },
  gstid: { type: mongoose.Schema.Types.ObjectId, ref: 'gst' },
  ccpercent: { type: Number },
  ccamount: { type: Number },
  cgstTotal: { type: Number },
  sgstTotal: { type: Number },
  igstTotal: { type: Number },
  cgstpercent: { type: Number },
  sgstpercent: { type: Number },
  igstpercent: { type: Number },
  allgst: { type: Number },
  totalcharges: { type: Number },
  commissionTotal: { type: Number },

}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('PMediaRO', Schema);