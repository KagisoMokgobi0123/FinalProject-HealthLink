import Medication from "../models/Medication.js";

// GET ALL MEDICATIONS
export const getMedications = async (req, res) => {
  try {
    const medications = await Medication.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, medications });
  } catch (error) {
    console.error("Get Medications Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET MEDICATION BY ID
export const getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication)
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });

    return res.status(200).json({ success: true, medication });
  } catch (error) {
    console.error("Get Medication Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ADD MEDICATION (Admin Only)
export const addMedication = async (req, res) => {
  try {
    const { drug, description } = req.body;
    if (!drug || !description)
      return res
        .status(400)
        .json({ success: false, error: "Drug name and description required" });

    const newMedication = new Medication({ drug, description });
    await newMedication.save();

    return res.status(201).json({
      success: true,
      message: "Medication added",
      medication: newMedication,
    });
  } catch (error) {
    console.error("Add Medication Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE MEDICATION (Admin Only)
export const updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication)
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });

    const { drug, description, status } = req.body;
    if (drug) medication.drug = drug;
    if (description) medication.description = description;
    if (status) medication.status = status;

    await medication.save();

    return res
      .status(200)
      .json({ success: true, message: "Medication updated", medication });
  } catch (error) {
    console.error("Update Medication Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// SOFT DELETE MEDICATION (Admin Only)
export const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication)
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });

    medication.status = "Inactive";
    await medication.save();

    return res
      .status(200)
      .json({ success: true, message: "Medication deactivated successfully" });
  } catch (error) {
    console.error("Delete Medication Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
