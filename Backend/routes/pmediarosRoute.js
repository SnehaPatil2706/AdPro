const express = require('express');
const mongoose = require('mongoose');
const PMediaRO = require('../models/PMediaROSchema');
const router = express.Router();

router.get("/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agency ID" });
        }

        const pmediaros = await PMediaRO.find({ agencyid })
            .populate('clientid')
            .populate('agencyid');

        if (!pmediaros.length) {
            return res.status(404).json({ status: "error", message: "No RO found for this agency" });
        }

        res.json({ status: "success", data: pmediaros });
    } catch (err) {
        console.error("Error fetching RO by agency:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch RO", error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        let result = await PMediaRO.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.get("/:agencyid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await PMediaRO.findById(id)
            .populate('clientid')
            .populate('agencyid');
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;
        
        // Save these fields into the database model
        let object = await PMediaRO.create(data);
        res.json({ status: "Success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.put('/:agencyid/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPMediaRO = await PMediaRO.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPMediaRO) {
            return res.status(404).json({ message: "PMediaRO not found" });
        }

        res.json({ status: "success", data: updatedPMediaRO });
    } catch (error) {
        console.error("Error updating PMediaRO:", error);
        res.status(500).json({ message: "Failed to update PMediaRO" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await PMediaRO.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;