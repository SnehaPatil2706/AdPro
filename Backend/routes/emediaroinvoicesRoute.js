const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const EMediaROInvoice = require('../models/EMediaROInvoiceSchema');

// Get all records
router.get("/", async (req, res) => {
    try {
        const result = await EMediaROInvoice.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        console.error("Error fetching all records:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// In your backend routes
router.get('/last-invoice', async (req, res) => {
  try {
    const lastInvoice = await EMediaROInvoice.findOne()
      .sort({ invoiceno: -1 }) // Sort by invoice number descending
      .select('invoiceno');
      
    res.json({
      status: 'success',
      data: lastInvoice || { invoiceno: 0 }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// Get records by agency ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await EMediaROInvoice.findById(id)
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

// Get records by roid and agency id
router.get('/:emediaroid', async (req, res) => {
  const invoice = await EMediaROInvoice.findOne({ emediaroid: req.params.emediaroid });
  if (!invoice) return res.status(404).json({ status: 'not found' });
  res.json({ status: 'success', data: invoice });
});


router.get("/agency/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;

        console.log("Requested Agency ID:", agencyid);

        // Ensure agencyid is a valid ObjectId
        if (!mongoose.isValidObjectId(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agency ID" });
        }

        const emediaros = await EMediaROInvoice.find({ agencyid: new mongoose.Types.ObjectId(agencyid) })
            .populate("clientid")
            .populate("gstid");

        res.json({ status: "success", data: emediaros });
    } catch (err) {
        console.error("Error fetching EMediaROs by agencyid:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch EMediaROInvoices by agency ID" });
    }
});

//get record by roid 
router.get('/by-ro/:emediaroid', async (req, res) => {
  try {
    const invoices = await EMediaROInvoice.find({ emediaroid: req.params.emediaroid });
    res.json({ status: 'success', data: invoices });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/by-emediaroid/:emediaroid', async (req, res) => {
  try {
    const { emediaroid } = req.params;
    const invoice = await EMediaROInvoice.findOne({ emediaroid: emediaroid })
      .populate('billclientid')
      .populate('invoicegstid')
      .populate('emediaroid');
    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }
    res.json({ status: 'success', data: invoice });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// In routes/emediaroRoute.js (or similar)
router.get('/:id', async (req, res) => {
  try {
    const emediaro = await EMediaRO.findById(req.params.id);
    if (!emediaro) {
      return res.status(404).json({ status: 'error', message: 'Record not found' });
    }
    res.json({ status: 'success', data: emediaro });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});



// Create a new record
// router.post("/", async (req, res) => {
//     try {
//         // console.log(req.body); // Log the request body for debugging

//         const data = req.body;
//         const object = await EMediaROInvoice.create(data);
//         res.json({ status: "success", data: object });
//     } catch (err) {
//         console.error("Error creating EMediaROInvoice:", err);
//         res.status(500).json({ status: "error", message: err.message });
//     }
// });

// filepath: d:\AdPro\Backend\routes\emediaroinvoices.js
router.post('/', async (req, res) => {
  try {
    const invoice = new EMediaROInvoice(req.body); // emediaroid will be included if sent
    await invoice.save();
    res.json({ status: 'success', data: invoice });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.post('/by-ro-ids', async (req, res) => {
  const { roIds } = req.body; // array of emediaroid
  const invoices = await EMediaROInvoice.find({ emediaroid: { $in: roIds } });
  res.json({ status: 'success', data: invoices });
});

// Update a record
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await EMediaROInvoice.findByIdAndUpdate(id, data, { new: true });
        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error updating EMediaROInvoice:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// For adding payment
router.patch('/:id/add-payment', async (req, res) => {
    try {
        const { payment } = req.body;
        const invoice = await EMediaROInvoice.findByIdAndUpdate(
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


// for deleting payment
router.patch('/:id/delete-payment', async (req, res) => {
    try {
        const { paymentId } = req.body;
        const invoice = await EMediaROInvoice.findByIdAndUpdate(
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

// Delete a record
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await EMediaROInvoice.findByIdAndDelete(id);
        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error deleting EMediaROInvoice:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;