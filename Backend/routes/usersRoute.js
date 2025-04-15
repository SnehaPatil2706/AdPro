let express = require('express');
const router = express.Router();
const User = require("../models/UserSchema");

router.get("/agency/:agencyid", async (req, res) => {
    try {
        let result = await User.find({agencyid: req.params.agencyid})
        .populate("roleid");
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});

router.get("/", async (req, res) => {
    try {
        let object = await User.find(req.params.id)
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        // const id = req.params.id;
        let object = await User.findById(req.params.id)
        .populate("roleid").populate("agencyid");
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;        
        // Check if email already exists
        let existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ status: "error", data: "User with this email already exist." });
        }
        let object = await User.create(data);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await User.findByIdAndUpdate(id, data, { new: true });        
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await User.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
