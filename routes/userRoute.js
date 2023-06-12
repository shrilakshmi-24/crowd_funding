const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "crowd";
const nodeMailer = require("nodemailer");
const auth = require("../middlewares/validateToken");
require("dotenv").config();

//user signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    console.log(req.body);
    //Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      ph_no: req.body.ph_no,
      is_donor: req.body.is_donor,
    });
    if (user) {
      sendVerifyEmail(req.body.name, req.body.email, user.id);

      res.status(200).send({
        success: true,
        message: "You have registered successfully",
        data: user,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//for send mail
const sendVerifyEmail = async (name, email, id) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "tuts_pack@hotmail.com",
        pass: process.env.pass,
      },
    });
    const mailOptions = {
      from: "tuts_pack@hotmail.com",
      to: email,
      subject: " Account Verification mail",
      html: `<p>Hi ${name},
      please click here to <a href="http://127.0.0.1:3000/verify?id=${id}">Verify</a>your mail.</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Verification mail has been sent ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//get all users

router.get("/user", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // const token = jwt.sign(
    //   { email: existingUser.email, id: existingUser.id },
    //   SECRET_KEY
    // );
    res.status(201).json({ user: existingUser });
  } catch (error) {
    res.status(500).json({ maessage: error.message });
  }
});

//updateUser

router.put("/updateUser/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//code to delete the user based on id
router.delete("/users/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

//verification

router.get("/verify", async (req, res) => {
  try {
    const info = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: true } }
    );
    res.status(200).json({ message: "your account has been verified" });
  } catch (error) {
    console.log(error.message);
  }
});

//All the donors
router.get("/donors", auth, async (req, res) => {
  try {
    const donors = await User.find({ is_donor: true });

    res.status(200).json({ success: true, donors });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while retrieving donors",
      });
  }
});

module.exports = router;
