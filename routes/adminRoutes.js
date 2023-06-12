const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "crowd";
const auth = require("../middlewares/validateToken");

router.post("/adminsignup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email: email });

    if (existingAdmin) {
      res.status(400).json({ message: "Admin already exists" });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    console.log(req.body);
    //Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword);

    const admin = await Admin.create({
      name: req.body.name,
      emailid: req.body.emailid,
      password: hashedPassword,
      org_id: req.body.org_id,
    });

    res.status(200).send({
      success: true,
      message: "You have registered successfully",
      data: admin,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all Admins

router.get("/admins", auth, async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//admin login
router.post("/adminsignin", async (req, res) => {
  const { emailid, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ emailid: emailid });
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const matchPassword = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    console.log(matchPassword);

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existingAdmin.email, id: existingAdmin.id },
      SECRET_KEY
    );
    res.status(201).json({ Admin: existingAdmin, token: token });
  } catch (error) {
    res.status(500).json({ maessage: error.message });
  }
});

//updateAdmin

router.put("/updateAdmin/:id", auth, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.save();
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete admin
router.delete("/admin/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const deleteAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deleteAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res
      .status(200)
      .json({ message: "deleteAdmin deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
