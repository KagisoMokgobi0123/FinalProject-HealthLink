import Medication from "../models/Medication.js";

// GET ALL MEDICATIONS
export const getMedications = async (req, res) => {
  try {
    const medications = await Medication.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, medications });
  } catch (error) {
    console.error("Get Medications Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching medications server error",
    });
  }
};

// GET MEDICATION BY ID
export const getMedicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findById(id);

    if (!medication) {
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });
    }

    return res.status(200).json({ success: true, medication });
  } catch (error) {
    console.error("Get Medication Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching medication failed",
    });
  }
};

// ADD NEW MEDICATION
export const addMedication = async (req, res) => {
  try {
    const { drug, description, status } = req.body;

    if (!drug || !description) {
      return res.status(400).json({
        success: false,
        error: "Drug name and description are required",
      });
    }

    const newMedication = new Medication({
      drug,
      description,
      status: status || "Active",
    });

    await newMedication.save();
    return res.status(201).json({
      success: true,
      message: "Medication added successfully",
      medication: newMedication,
    });
  } catch (error) {
    console.error("Add Medication Error:", error);
    return res.status(500).json({
      success: false,
      error: "Adding medication server error",
      details: error.message,
    });
  }
};

// UPDATE MEDICATION
export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { drug, description, status } = req.body;

    const existingMedication = await Medication.findById(id);
    if (!existingMedication)
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });

    if (drug) existingMedication.drug = drug;
    if (description) existingMedication.description = description;
    if (status) existingMedication.status = status;

    await existingMedication.save();
    return res.status(200).json({
      success: true,
      message: "Medication updated successfully",
      medication: existingMedication,
    });
  } catch (error) {
    console.error("Update Medication Error:", error);
    return res.status(500).json({
      success: false,
      error: "Updating medication server error",
    });
  }
};

// DELETE MEDICATION
export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findById(id);
    if (!medication)
      return res
        .status(404)
        .json({ success: false, error: "Medication not found" });

    await Medication.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Medication deleted successfully",
    });
  } catch (error) {
    console.error("Delete Medication Error:", error);
    return res.status(500).json({
      success: false,
      error: "Deleting medication server error",
    });
  }
};
