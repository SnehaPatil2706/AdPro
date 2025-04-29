const express = require('express');
const mongoose = require('mongoose');
const InvoiceDetails = require('../models/InvoiceDetailsSchema'); // InvoiceDetails model

const router = express.Router();

// 🔹 Get all invoice details for a specific invoice
router.get("/:invoiceid", async (req, res) => {
    try {
        const { invoiceid } = req.params;

        // Validate invoice ID
        if (!mongoose.Types.ObjectId.isValid(invoiceid)) {
            return res.status(400).json({ status: "error", message: "Invalid invoice ID" });
        }

        // Fetch all details for the given invoice ID
        const details = await InvoiceDetails.find({ invoiceid });
        if (!details.length) {
            return res.status(404).json({ status: "error", message: "No details found for this invoice" });
        }

        res.json({ status: "success", data: details });
    } catch (err) {
        console.error("Error fetching invoice details:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch invoice details" });
    }
});

// 🔹 Create new invoice detail
router.post("/", async (req, res) => {
    try {
        const data = req.body;

        // Create new invoice detail in the database
        const newDetail = await InvoiceDetails.create(data);
        res.json({ status: "success", data: newDetail });
    } catch (err) {
        console.error("Error creating invoice detail:", err);
        res.status(500).json({ status: "error", message: "Failed to create invoice detail" });
    }
});

// 🔹 Update an invoice detail
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate detail ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid detail ID" });
        }

        // Update invoice detail
        const updatedDetail = await InvoiceDetails.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ status: "success", data: updatedDetail });
    } catch (err) {
        console.error("Error updating invoice detail:", err);
        res.status(500).json({ status: "error", message: "Failed to update invoice detail" });
    }
});

// 🔹 Delete an invoice detail
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Validate detail ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "error", message: "Invalid detail ID" });
        }

        // Delete invoice detail
        const deletedDetail = await InvoiceDetails.findByIdAndDelete(id);
        res.json({ status: "success", data: deletedDetail });
    } catch (err) {
        console.error("Error deleting invoice detail:", err);
        res.status(500).json({ status: "error", message: "Failed to delete invoice detail" });
    }
});

module.exports = router;