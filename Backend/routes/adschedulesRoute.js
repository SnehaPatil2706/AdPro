let express = require('express');
const router = express.Router();
const AdSchedule = require("../models/AdScheduleSchema");

router.get("/agency/:agencyid", async (req, res) => {
    try {
        let result = await AdSchedule.find({agencyid: req.params.agencyid})
        .populate("clientid").populate("pmediaid");
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});

router.get("/", async (req, res) => {
    try {
        let result = await AdSchedule.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});

router.get("/:id", async (req, res) => {
    try {
        // const id = req.params.id;
        let object = await AdSchedule.findById(req.params.id)
        .populate("clientid").populate("pmediaid").populate("agencyid");
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        let object = await AdSchedule.create(data);
        res.json({ status: "Success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await AdSchedule.findByIdAndUpdate(id, data, { new: true });        
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await AdSchedule.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
