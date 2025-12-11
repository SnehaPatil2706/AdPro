const express = require('express');
const mongoose = require('mongoose');
const EMediaRO = require('../models/EMediaROSchema');
const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
    try {
        const result = await EMediaRO.find({});
        res.json({ status: "success", data: result });
    } catch (err) {
        console.error("Error fetching all records:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// In your backend route file
router.get('/lastrono', async (req, res) => {
  try {
    const lastRO = await EMediaRO.findOne().sort({ rono: -1 }).limit(1);
    res.json({ 
      lastRONumber: lastRO ? lastRO.rono : 0 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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

        const emediaros = await EMediaRO.find({ agencyid: new mongoose.Types.ObjectId(agencyid) })
            .populate("clientid")
            .populate("emediaid")
            .populate("gstid");

        res.json({ status: "success", data: emediaros });
    } catch (err) {
        console.error("Error fetching EMediaROs by agencyid:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch EMediaROs by agency ID" });
    }
});

// Get a single record by ID
// router.get("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({ status: "error", message: "Invalid ID" });
//         }

//         const object = await EMediaRO.findById(id)
//             .populate("clientid")
//             .populate("emediaid")
//             .populate("gstid");

//         if (!object) {
//             return res.status(404).json({ status: "error", message: "Record not found" })
//         }

//         res.json({ status: "success", data: object });
//     } catch (err) {
//         console.error("Error fetching by ID:", err);
//         res.status(500).json({ status: "error", message: err.message });
//     }
// });

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await EMediaRO.findById(id)
            .populate("clientid")
            .populate("emediaid")
            .populate("gstid");

        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error fetching by ID:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});


// Create a new record
router.post("/", async (req, res) => {
    try {
        // console.log(req.body); // Log the request body for debugging

        const data = req.body;
        const object = await EMediaRO.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error creating EMediaRO:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Update a record
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await EMediaRO.findByIdAndUpdate(id, data, { new: true });
        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error updating EMediaRO:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Delete a record
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ status: "error", message: "Invalid ID" });
        }

        const object = await EMediaRO.findByIdAndDelete(id);
        if (!object) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        res.json({ status: "success", data: object });
    } catch (err) {
        console.error("Error deleting EMediaRO:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
