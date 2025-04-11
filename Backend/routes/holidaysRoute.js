let express = require('express');
const router = express.Router();
const Holiday = require("../models/HolidaySchema");

// Fetch all holidays for a specific agency
router.get("/:agencyid", async (req, res) => {
    try {
        const agencyid = req.params.agencyid;
        let result = await Holiday.find({ agencyid }); // Filter by agencyid
        res.status(200).json({ status: "success", data: result });
    } catch (err) {
        console.error("Error fetching holidays:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch holidays", error: err });
    }
});

// Fetch a single holiday by its ID
router.get("/holiday/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Holiday.findById(id);
        if (!object) {
            return res.status(404).json({ status: "error", message: "Holiday not found" });
        }
        res.status(200).json({ status: "success", data: object });
    } catch (err) {
        console.error("Error fetching holiday:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch holiday", error: err });
    }
});

// Add a new holiday
router.post("/", async (req, res) => {
    try {
        const data = req.body;

        console.log("Received data for new holiday:", data); // Debugging: Log the incoming data

        // Validate required fields
        if (!data.agencyid || !data.hdate || !data.reason) {
            return res.status(400).json({ status: "error", message: "Missing required fields" });
        }

        let object = await Holiday.create(data);
        console.log("Created holiday:", object); // Debugging: Log the created holiday

        res.status(201).json({ status: "success", data: object });
    } catch (err) {
        console.error("Error creating holiday:", err); // Debugging: Log the error
        res.status(500).json({ status: "error", message: "Failed to create holiday", error: err });
    }
});

// Update an existing holiday
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        let object = await Holiday.findByIdAndUpdate(id, data, { new: true });
        if (!object) {
            return res.status(404).json({ status: "error", message: "Holiday not found" });
        }

        res.status(200).json({ status: "success", data: object });
    } catch (err) {
        console.error("Error updating holiday:", err);
        res.status(500).json({ status: "error", message: "Failed to update holiday", error: err });
    }
});

// In your routes file, modify the delete endpoint:
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        let object = await Holiday.findByIdAndDelete(id);
        if (!object) {
            return res.status(404).json({ status: "error", message: "Holiday not found" });
        }
        // Return consistent success structure
        res.status(200).json({ 
            status: "success", 
            message: "Holiday deleted successfully",
            data: object 
        });
    } catch (err) {
        console.error("Error deleting holiday:", err);
        res.status(500).json({ status: "error", message: "Failed to delete holiday", error: err });
    }
});

const handleSaveHoliday = async (e) => {
  e.preventDefault();
  const holidayData = {
    agencyid: agency._id,
    hdate: dayjs(selectedDate).format('YYYY-MM-DD'), // Ensure consistent date format
    reason: holidayName,
    every_year: recurring,
  };

  console.log("Saving holiday:", holidayData); // Debugging: Log the data being sent

  try {
    const response = await axios.post("http://localhost:8081/holidays", holidayData);
    console.log("Save response:", response.data); // Debugging: Log the API response

    if (response.status === 201) {
      message.success("Holiday added successfully");

      // Update the holidayList state immediately
      setHolidayList((prevList) => [
        ...prevList,
        { ...holidayData, _id: response.data.data._id }, // Assuming the response contains the new holiday's ID
      ]);

      // Reset modal inputs
      setShowModal(false);
      setHolidayName('');
      setRecurring(false);
      setSelectedDate(null);
    } else {
      message.error("Failed to save holiday");
    }
  } catch (error) {
    console.error("Save failed:", error); // Debugging: Log the error
    message.error("Failed to save holiday");
  }
};

module.exports = router