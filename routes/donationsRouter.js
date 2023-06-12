const Donation = require("../models/donationsModel");
const router = require("express").Router();
const User = require("../models/userModel");
const nodeMailer = require("nodemailer");
const auth = require("../middlewares/validateToken");

//post donations
router.post("/donations", auth, async (req, res) => {
  try {
    const donation = await Donation.create(req.body);
    const user = await User.findById(donation.donor).select("email");
    console.log(user);
    if (user) {
      sendVerifyEmail(req.body.name, user.email, donation.amount);

      res.status(200).send({
        success: true,
        message: "donations created successfully",
        data: donation,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//send mail
const sendVerifyEmail = async (name, email, amount) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "tuts_pack@hotmail.com",
        pass: "vvivtvlxfdezijcr",
      },
    });
    const mailOptions = {
      from: "tuts_pack@hotmail.com",
      to: email,
      subject: "Donation Confirmation",
      text: `Thank you for your donation of $${amount}. We appreciate your support!`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Mail has been sent ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get all the donations
router.get("/donations", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page

    const skip = (page - 1) * limit;

    const totalCount = await Donation.countDocuments({});

    const donations = await Donation.find({}).skip(skip).limit(limit).exec();

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      donations,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//update is_donor
router.put("/update-is-donor", auth, async (req, res) => {
  try {
    const donorIds = await Donation.distinct("donor");
    console.log(donorIds);

    await User.updateMany({ _id: { $in: donorIds } }, { is_donor: true });

    res
      .status(200)
      .json({
        success: true,
        message: "is_donor field updated for all donors",
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while updating is_donor field",
      });
  }
});
//

//total amount donated by particular donor
router.get("/totalamountdonated/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const donations = await Donation.find({ donor: userId });

    let totalAmountDonated = 0;
    donations.forEach((donation) => {
      totalAmountDonated += donation.amount;
    });

    res.status(200).json({ success: true, totalAmountDonated });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while retrieving total amount donated",
      });
  }
});

//sorting the users by total donation amount
router.get("/donors/sortedByDonationAmount", auth, async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          is_donor: true,
        },
      },
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "donor",
          as: "donations",
        },
      },
      {
        $addFields: {
          totalDonationAmount: {
            $sum: "$donations.amount",
          },
        },
      },
      {
        $sort: {
          totalDonationAmount: -1,
        },
      },
    ];

    const donors = await User.aggregate(pipeline);

    res.status(200).json({ success: true, donors });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while sorting donors by donation amount",
      });
  }
});

module.exports = router;
