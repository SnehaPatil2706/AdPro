let express = require('express');
const router = express.Router();
const EMedia = require("../models/EMediaSchema");

router.get("/", async (req, res) => {
    try {
        let result = await EMedia.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await EMedia.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        let object = await EMedia.create(data);
        res.json({ status: "Success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await EMedia.findByIdAndUpdate(id, data, { new: true });        
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await EMedia.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
