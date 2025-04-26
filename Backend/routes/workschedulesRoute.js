let express = require('express');
const router = express.Router();
const WorkSchedule = require("../models/WorkScheduleSchema");
const mongoose = require("mongoose");

router.get("/agency/:agencyid", async (req, res) => {
    try {
        let result = await WorkSchedule.find({agencyid: req.params.agencyid})
        .populate("userid");
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});



router.get("/", async (req, res) => {
    try {
        let object = await WorkSchedule.find(req.params.id)
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        // const id = req.params.id;
        let object = await WorkSchedule.findById(req.params.id)
        .populate("userid").populate("agencyid");
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        let object = await WorkSchedule.create(data);
        res.json({ status: "Success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await WorkSchedule.findByIdAndUpdate(id, data, { new: true });        
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await WorkSchedule.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
