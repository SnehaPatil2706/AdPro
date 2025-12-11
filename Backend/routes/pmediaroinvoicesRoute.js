const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const PMediaRO = require('../models/PMediaROSchema');
const PMediaROInvoice = require('../models/PMediaROInvoiceSchema');

// ==========================
// READ ROUTES
// ==========================

// Get all records
router.get("/", async (req, res) => {
    try {
        const result = await PMediaROInvoice.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        console.error("Error fetching all records:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Get invoice by RO ID (single)
router.get('/by-ro/:pmediaroid', async (req, res) => {
    try {
        const roid = new mongoose.Types.ObjectId(req.params.pmediaroid);
        const invoices = await PMediaROInvoice.find({ pmediaroid: roid });
        res.json({ status: 'success', data: invoices || null });
    } catch (err) {
        console.error("Error fetching RO invoices:", err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Get invoice by RO ID with population (single)
router.get('/by-pmediaroid/:pmediaroid', async (req, res) => {
  try {
    const { pmediaroid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pmediaroid)) {
      return res.status(400).json({ status: 'error', message: 'Invalid pmediaroid' });
    }
    const invoices = await PMediaROInvoice.find({ pmediaroid: new mongoose.Types.ObjectId(pmediaroid) })
      .populate('billclientid')
      .populate('invoicegstid')
      .populate('pmediaroid');
    res.json({ status: 'success', data: invoices[0] }); // Return the first invoice if you expect one
  } catch (err) {
    console.error("Error fetching invoices by pmediaroid:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Get multiple invoices by array of RO IDs
router.post('/by-ro-ids', async (req, res) => {
    try {
        const { roIds } = req.body;
        const objectIds = roIds.map(id => new mongoose.Types.ObjectId(id));
        const invoices = await PMediaROInvoice.find({ pmediaroid: { $in: objectIds } });
        res.json({ status: 'success', data: invoices });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Get invoice by ID with population
router.get("/invoice/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await PMediaROInvoice.findById(id)
            .populate("billclientid")
            .populate("invoicegstid");

        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error fetching by ID:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Get invoice with agency ID and invoice ID
router.get("/:agencyid/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const object = await PMediaROInvoice.findById(id)
            .populate('billclientid')
            .populate('agencyid');
        res.json({ status: "success", data: object });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Get RO by ID (from PMediaRO model)
router.get('/ro/:id', async (req, res) => {
    try {
        const pmediaro = await PMediaRO.findById(req.params.id);
        if (!pmediaro) {
            return res.status(404).json({ status: 'error', message: 'Record not found' });
        }
        res.json({ status: 'success', data: pmediaro });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// ==========================
// CREATE ROUTE
// ==========================
router.post("/", async (req, res) => {
    try {
        const invoice = new PMediaROInvoice(req.body);
        await invoice.save();
        res.json({ status: "success", data: invoice });
    } catch (err) {
        console.error("Error creating PMediaROInvoice:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// ==========================
// UPDATE ROUTES
// ==========================

// Update full record
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await PMediaROInvoice.findByIdAndUpdate(id, data, { new: true });
        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error updating PMediaROInvoice:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Add a payment
router.patch('/:id/add-payment', async (req, res) => {
    try {
        const { payment } = req.body;
        const invoice = await PMediaROInvoice.findByIdAndUpdate(
            req.params.id,
            { $push: { payments: payment } },
            { new: true }
        );
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Payment added', data: invoice });
    } catch (err) {
        res.status(500).json({ message: 'Error adding payment', error: err.message });
    }
});

// Delete a payment
router.patch('/:id/delete-payment', async (req, res) => {
    try {
        const { paymentId } = req.body;
        const invoice = await PMediaROInvoice.findByIdAndUpdate(
            req.params.id,
            { $pull: { payments: { _id: paymentId } } },
            { new: true }
        );
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json({ message: 'Payment deleted', data: invoice });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting payment', error: err.message });
    }
});

// ==========================
// DELETE ROUTE
// ==========================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await PMediaROInvoice.findByIdAndDelete(id);
        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error deleting PMediaROInvoice:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;