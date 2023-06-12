const Beneficiary = require("../models/benificiaryModel");
const router = require("express").Router();

//post beneficiary
router.post("/beneficiary", async (req, res) => {
  try {
    const beneficiary = await Beneficiary.create({
      name: req.body.name,
      email: req.body.email,
      profile_img: req.body.profile_img,
      ph_no: req.body.ph_no,
      address: req.body.address,
      id_proof: req.body.id_proof,
      document_id: req.body.document_id,
    });

    res.status(200).send({
      success: true,
      message: "beneficiary created successfully",
      data: beneficiary,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all beneficiaries
router.get("/beneficiary", async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({});
    res.status(200).json(beneficiaries);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//updateBeneficiary

router.put("/updateBeneficiary/:id", async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!beneficiary) {
      return res.status(404).json({ message: "Beneficiary not found" });
    }

    await Beneficiary.save();
    res.status(200).json(beneficiary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete beneficiary
router.delete("/beneficiary/:benId", async (req, res) => {
  try {
    const benId = req.params.benId;

    const deleteBeneficiary = await Beneficiary.findByIdAndDelete(benId);

    if (!deleteBeneficiary) {
      return res.status(404).json({ message: " Beneficiary not found" });
    }

    return res
      .status(200)
      .json({ message: "Beneficiary deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
