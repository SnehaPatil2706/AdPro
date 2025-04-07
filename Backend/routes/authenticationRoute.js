let express = require('express');
const router = express.Router();
const Agency = require("../models/AgencySchema");
const User = require("../models/UserSchema");


router.post("/register", async (req, res) => {
    try {
        const data = req.body;
        // Check if email already exists
        let existingAgency = await Agency.findOne({ email: data.email });
        if (existingAgency) {
            res.json({ status: "failed", data: "Agency with this email already exist." });
        }

        let object = await Agency.create(data);
        //Create user account
        let user = new User({
            agencyid: object._id,
            name: data.ownername,
            email: data.email,
            password: "123456",
            roleid: "67f39f79da9c1501eba3e9d4"
        });
        await User.create(user);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});


router.post("/login", async (req, res) => {
    try {
        const data = req.body;
        let user = await User.findOne({ email: data.email });
        if (user) {
            if(user.password == data.password){
                let agency = await Agency.findById(user.agencyid);
                res.json({ status: "success", data: {name:user.name, id:user._id, email:user.email, roleid : user.roleid}, agency : agency });
            }else{
                res.json({ status: "failed", data: "Invalid password." });
            }
        }
        else{
            res.json({ status: "failed", data: "User not found." });
        }
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

module.exports = router;
