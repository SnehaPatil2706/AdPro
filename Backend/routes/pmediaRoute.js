let express = require('express');
const router = express.Router();
const PMedia = require("../models/PMediaSchema");
const mongoose = require("mongoose");

router.get("/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;

        // Validate agencyid
        if (!mongoose.isValidObjectId(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agency ID" });
        }

        // Fetch pmedia by agencyid
        const pmedias = await PMedia.find({ agencyid: new mongoose.Types.ObjectId(agencyid) });
            

        res.json({ status: "success", data: pmedias });
    } catch (err) {
        console.error("Error fetching pmedias:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch pmedia" });
    }
});

router.get("/", async (req, res) => {
    try {
        let result = await PMedia.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await PMedia.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        let object = await PMedia.create(data);
        res.json({ status: "Success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await PMedia.findByIdAndUpdate(id, data, { new: true });        
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await PMedia.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
