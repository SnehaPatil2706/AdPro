let express = require('express');
const router = express.Router();
const RoleModule = require("../models/RoleModuleSchema");

router.get("/", async (req, res) => {
    try {
        let result = await RoleModule.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err});
    }
});


module.exports = router;
