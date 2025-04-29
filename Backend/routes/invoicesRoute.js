const express = require('express');
const mongoose = require('mongoose');
const Invoice = require('../models/InvoiceSchema'); // Invoice model

const router = express.Router();

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


// 🔹 Get single invoice by ID (place this route first)
router.get("/:agencyid/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate invoice ID
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
        console.error("Error fetching invoice:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch invoice" });
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

// 🔹 Get all invoices
router.get("/", async (req, res) => {
    try {
        console.log("Fetching all invoices...");
        const invoices = await Invoice.find()
            .populate('clientid')
            .populate('agencyid');
        console.log("Fetched invoices:", invoices.length);

        res.json({ status: "success", data: invoices });
    } catch (err) {
        console.error("Error fetching all invoices:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch invoices" });
    }
});


// 🔹 Create new invoice
router.post("/", async (req, res) => {
    try {
        const data = req.body;

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
        const { taxableAmount, amount, discount } = data;
        data.billAmount = (taxableAmount || 0) + (amount || 0) - (discount || 0);

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
// Add a payment to an invoice
router.put('/invoices/:id/payments', async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const { paymentDate, description, amount } = req.body;

        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({ status: 'error', message: 'Invoice not found' });
        }

        // Add the new payment
        invoice.payments.push({
            paymentDate,
            description,
            amount,
        });

        // Update remaining amount
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
        invoice.remaining = invoice.billAmount - totalPaid;

        await invoice.save();

        res.json({ status: 'success', message: 'Payment added successfully', invoice });
    } catch (error) {
        console.error('Error saving payment:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
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