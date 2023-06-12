const Cause = require("../models/causesModel");
const Donation = require("../models/donationsModel");
const User = require("../models/userModel");
const router = require("express").Router();
const path = require("path");
const mongoose = require("mongoose");
const upload = require("../middlewares/multer");
const auth = require("../middlewares/validateToken");

//get causes with pagination
router.get("/cause", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const skip = (page - 1) * limit;
    const totalCount = await Cause.countDocuments({});
    const causes = await Cause.find({}).skip(skip).limit(limit).exec();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      causes,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//post causes
router.post("/cause", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      total_amount,
      collected_amount,
      image,
      start_date,
      end_date,
      beneficiary,
      organization,
    } = req.body;

    const pending_amount = total_amount - collected_amount;

    const cause = await Cause.create({
      name,
      description,
      total_amount,
      collected_amount,
      image: image,
      start_date,
      end_date,
      pending_amount,
      beneficiary,
      organization,
    });

    res.status(200).send({
      success: true,
      message: "Campaign created successfully",
      data: cause,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get donor details for particular cause
router.get("/causedonors/:causeId", async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.causeId);
    if (!cause) {
      return res.status(404).json({ message: "Cause not found" });
    }
    const donations = await Donation.find({ cause: cause._id });
    const donorIds = donations.map((donation) => donation.donor);
    const donors = await User.find({ _id: { $in: donorIds } });
    res.json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//total amount for particular cause
router.get("/causeamount/:causeId", auth, async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.causeId);
    if (!cause) {
      return res.status(404).json({ message: "Cause not found" });
    }
    const result = await Donation.aggregate([
      {
        $match: { cause: cause._id },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    res.json(result[0].totalAmount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//completed tasks
router.get("/completedCauses", auth, async (req, res) => {
  try {
    const causes = await Cause.find({ status: "completed" });
    res.json(causes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//pending causes
router.get("/pendingCauses", async (req, res) => {
  try {
    const causes = await Cause.find({ status: "pending" });
    res.json(causes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//update causes
router.put("/updateCause/:id", auth, async (req, res) => {
  try {
    const cause = await Cause.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cause) {
      return res.status(404).json({ message: "Cause not found" });
    }
    if (cause.collected_amount === cause.total_amount) {
      cause.status = "completed";
    }
    await cause.save();
    res.json(cause);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//code to delete the cause based on id
router.delete("/causes/:causeId", auth, async (req, res) => {
  try {
    const causeId = req.params.causeId;

    const deletedCause = await Cause.findByIdAndDelete(causeId);

    if (!deletedCause) {
      return res.status(404).json({ message: "Cause not found" });
    }

    return res.status(200).json({ message: "Cause deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

//sort based on oldest causes
router.get("/causes/oldest", async (req, res) => {
  try {
    const causes = await Cause.find().sort({ start_date: 1 });

    res.status(200).json({ success: true, causes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving causes",
    });
  }
});

//latest causes
router.get("/causes/latest", async (req, res) => {
  try {
    const causes = await Cause.find().sort({ start_date: -1 });

    res.status(200).json({ success: true, causes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving causes",
    });
  }
});

module.exports = router;
