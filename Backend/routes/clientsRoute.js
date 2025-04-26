const express = require("express");
const router = express.Router();
const Client = require("../models/ClientSchema");
// require("../models/StateSchema"); // Just registering it is enough for populate to work
const mongoose = require("mongoose");

router.get("/:agencyid", async (req, res) => {
    try {
        const { agencyid } = req.params;

        // Validate agencyid
        if (!mongoose.isValidObjectId(agencyid)) {
            return res.status(400).json({ status: "error", message: "Invalid agency ID" });
        }

        // Fetch clients by agencyid
        const clients = await Client.find({ agencyid: new mongoose.Types.ObjectId(agencyid) })
            .populate("stateid", "name") // Populate state name
            .exec();

        res.json({ status: "success", data: clients });
    } catch (err) {
        console.error("Error fetching clients:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch clients" });
    }
});

router.get("/:agencyid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Client.findById(id)
        .populate("stateid").populate("agencyid").populate("clientid");
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        let object = await Client.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await Client.findByIdAndUpdate(id, data, { new: true });        
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Client.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
