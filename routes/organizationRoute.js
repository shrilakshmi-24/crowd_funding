const Organization = require("../models/organization");
const router = require("express").Router();
const auth = require("../middlewares/validateToken");

//post organization
router.post("/org", auth, async (req, res) => {
  try {
    const organization = await Organization.create({
      name: req.body.name,
      code: req.body.code,
      location: req.body.location,
    });

    res.status(200).send({
      success: true,
      message: "organization created successfully",
      data: organization,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get organizations

router.get("/org", auth, async (req, res) => {
  try {
    const orgs = await Organization.find({});
    res.status(200).json(orgs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete organization
router.delete("/organization/:organizationId", auth, async (req, res) => {
  try {
    const organizationId = req.params.organizationId;

    const deleteorganization = await Organization.findByIdAndDelete(
      organizationId
    );

    if (!deleteorganization) {
      return res.status(404).json({ message: "organization not found" });
    }

    return res
      .status(200)
      .json({ message: "deleteorganization deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
