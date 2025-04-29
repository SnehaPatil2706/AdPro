let express = require('express');
const router = express.Router();
const GST = require("../models/GSTSchema");


// router.get("/:agencyid", async (req, res) => {
//     try {
//         const { agencyid } = req.params;

//         // Validate agencyid
//         if (!mongoose.isValidObjectId(agencyid)) {
//             return res.status(400).json({ status: "error", message: "Invalid agency ID" });
//         }

//         // Fetch pmedia by agencyid
//         const gsts = await GST.find({ agencyid: new mongoose.Types.ObjectId(agencyid) });


//         res.json({ status: "success", data: gsts });
//     } catch (err) {
//         console.error("Error fetching gsts:", err);
//         res.status(500).json({ status: "error", message: "Failed to fetch gst" });
//     }
// });

// // Get single GST type by ID (agency-specific)
// router.get("/:agencyid/:id", async (req, res) => {
//     try {
//         const { agencyid, id } = req.params;

//         // Validate IDs
//         if (!agencyid || agencyid.length !== 24 || !id || id.length !== 24) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Invalid ID format"
//             });
//         }

//         const gstType = await GST.findOne({ _id: id, agencyid });

//         if (!gstType) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "GST type not found or doesn't belong to this agency"
//             });
//         }

//         res.json({
//             status: "success",
//             data: gstType
//         });

//     } catch (err) {
//         console.error("Error fetching GST type:", err);
//         res.status(500).json({
//             status: "error",
//             message: "Internal server error",
//             error: err.message
//         });
//     }
// });


router.get("/:agencyid", async (req, res) => {
    try {
        const { agencyId } = req.params;
        const result = await GST.find({ agencyId });
        res.json({ status: "success", data: result });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.get("/:agencyid/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await GST.findById(id);
        // .populate("agencyid").populate("gstid");
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.get("/", async (req, res) => {
    try {
        let result = await GST.find({});
        res.json({ status: "success", data: result })
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await GST.findById(id);
        res.json({ status: "success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        let object = await GST.create(data);
        res.json({ status: "Success", data: object });
    } catch (err) {
        res.json({ status: "error", data: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        let object = await GST.findByIdAndUpdate(id, data, { new: true });
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await GST.findByIdAndDelete(id);
        res.send({ status: "success", data: object });
    } catch (err) {
        res.send({ status: "error", data: err });
    }
});

module.exports = router;
