let express = require('express');
const router = express.Router();
const ModuleMenu = require("../models/ModuleMenuSchema");

router.get("/", async (req, res) => {
    try {
        let result = await ModuleMenu.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});


module.exports = router;
