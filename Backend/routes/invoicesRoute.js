const express = require('express');
const mongoose = require('mongoose');
const Invoice = require('../models/InvoiceSchema');
const InvoiceDetails = require("../models/InvoiceDetailsSchema");

const router = express.Router();

// 🔹 Get all invoices
router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('clientid')
            .populate('agencyid');

        res.json({ status: "success", data: invoices });
    } catch (err) {
        console.error("Error fetching all invoices:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch invoices" });
    }
});

// Get records by agency ID
router.get("/agency/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;

        console.log("Requested Agency ID:", agencyid);

        // Ensure agencyid is a valid ObjectId
        if (!mongoose.isValidObjectId(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agency ID" });
        }

        const emediaros = await Invoice.find({ agencyid: new mongoose.Types.ObjectId(agencyid) })
            .populate("clientid")
            .populate("gstType");

        res.json({ status: "success", data: emediaros });
    } catch (err) {
        console.error("Error fetching EMediaROs by agencyid:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch EMediaROs by agency ID" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await Invoice.findById(id)
            .populate("clientid")
            .populate("gstType");

        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error fetching by ID:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

router.get("/last/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;
        const lastInvoice = await Invoice.findOne({ agencyid }).sort({ createdAt: -1 });
        const nextInvoiceNo = lastInvoice
            ? (parseInt(lastInvoice.invoiceNo, 10) + 1).toString().padStart(3, "0")
            : "001";
        res.json({ status: "success", invoiceNo: nextInvoiceNo });
    } catch (err) {
        console.error("Error fetching last invoice number:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch last invoice number" });
    }
});

router.get("/:agencyid/:id", async (req, res) => {
    console.log(req.params.agencyid, req.params.id);
    try {
        const { agencyid, id } = req.params;


        // Check if agencyid is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agencyid" });
        }

        // Check if id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid invoice ID" });
        }

        // Fetch the main invoice with the correct agencyid and invoice id
        const invoice = await Invoice.findOne({ _id: id, agencyid }).populate("clientid");

        if (!invoice) {
            return res.json({ status: "error", message: "Invoice not found" });
        }

        // Fetch the invoice details (items) linked to this invoice
        const invoiceDetails = await InvoiceDetails.find({ invoiceid: id });

        // Merge invoice and its details into one response
        const fullInvoice = {
            ...invoice._doc,   // spread invoice fields
            items: invoiceDetails  // add items array
        };

        res.json({ status: "success", data: fullInvoice });
    } catch (err) {
        console.error(err);
        res.json({ status: "error", message: err.message });
    }
});

// 🔹 Get invoices by agency ID

router.get("/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agency ID" });
        }

        const invoices = await Invoice.find({ agencyid })
            .populate('clientid')
            .populate('agencyid');

        if (!invoices.length) {
            return res.status(404).json({ status: "error", message: "No invoices found for this agency" });
        }

        res.json({ status: "success", data: invoices });
    } catch (err) {
        console.error("Error fetching invoices by agency:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch invoices", error: err.message });
    }
});

// 🔹 Get invoice by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid invoice ID" });
        }

        const invoice = await Invoice.findById(id)
            .populate('clientid')
            .populate('agencyid');

        if (!invoice) {
            return res.status(404).json({ status: "error", message: "Invoice not found" });
        }

        res.json({ status: "success", data: invoice });
    } catch (err) {
        console.error("Error fetching invoice by ID:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch invoice" });
    }
});

// Example backend code (Node.js/Express)
router.get('/invoices', async (req, res) => {
  try {
    let query = {};
    
    if (req.query.clientid) {
      query.clientid = req.query.clientid;
    }
    
    if (req.query.fromDate && req.query.toDate) {
      query.invoiceDate = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate)
      };
    }
    
    const invoices = await Invoice.find(query).populate('clientid');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// For adding payment
router.patch('/:id/add-payment', async (req, res) => {
    try {
        const { payment } = req.body;
        const invoice = await Invoice.findByIdAndUpdate(
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
        const invoice = await Invoice.findByIdAndUpdate(
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


// 🔹 Create new invoice
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);


        // Debugging: Log the incoming request body
        console.log("Incoming request body:", data);

        // Validate required fields
        if (!data.agencyid || !data.invoiceDate || !data.clientid || !data.amount || !data.taxableAmount || !data.billAmount || !data.gstType) {
            return res.status(400).json({ status: "error", message: "Missing required fields" });
        }

        // Find the latest invoice for the same agency
        const lastInvoice = await Invoice.findOne({ agencyid: data.agencyid }).sort({ createdAt: -1 });

        let newNumber = "001";

        if (lastInvoice && lastInvoice.invoiceNo) {
            // Extract numeric part and increment
            const lastNumber = parseInt(lastInvoice.invoiceNo, 10);
            newNumber = (lastNumber + 1).toString().padStart(3, "0");
        }
        const { taxableAmount, amount, discount, cgstAmount, sgstAmount, igstAmount } = data;
        data.billAmount = ((taxableAmount || 0) + (cgstAmount + sgstAmount + igstAmount));

        const newInvoice = await Invoice.create({
            ...data,
            invoiceNo: newNumber
        });

        res.status(201).json({ status: "success", data: newInvoice });
    } catch (err) {
        console.error("Error creating invoice:", err); // Debugging log
        res.status(500).json({ status: "error", message: "Failed to create invoice", error: err.message });
    }
});


// 🔹 Update invoice
router.put('/:agencyid/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.json({ status: "success", data: updatedInvoice });
    } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({ message: "Failed to update invoice" });
    }
});

// 🔹 Delete invoice
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid invoice ID" });
        }

        const deletedInvoice = await Invoice.findByIdAndDelete(id);

        if (!deletedInvoice) {
            return res.status(404).json({ status: "error", message: "Invoice not found" });
        }

        res.json({ status: "success", data: deletedInvoice });
    } catch (err) {
        console.error("Error deleting invoice:", err);
        res.status(500).json({ status: "error", message: "Failed to delete invoice" });
    }
});


module.exports = router;