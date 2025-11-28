import Allergy from "../models/Allergy.js";

// GET ALL ALLERGIES
export const getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, allergies });
  } catch (error) {
    console.error("Get Allergies Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET ALLERGY BY ID
export const getAllergyById = async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);
    if (!allergy)
      return res
        .status(404)
        .json({ success: false, error: "Allergy not found" });

    return res.status(200).json({ success: true, allergy });
  } catch (error) {
    console.error("Get Allergy Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ADD ALLERGY
export const addAllergy = async (req, res) => {
  try {
    const { allergyName, description } = req.body;
    if (!allergyName || !description)
      return res
        .status(400)
        .json({ success: false, error: "Name and description required" });

    const newAllergy = new Allergy({ allergyName, description });
    await newAllergy.save();

    return res
      .status(201)
      .json({ success: true, message: "Allergy added", allergy: newAllergy });
  } catch (error) {
    console.error("Add Allergy Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE ALLERGY
export const updateAllergy = async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);
    if (!allergy)
      return res
        .status(404)
        .json({ success: false, error: "Allergy not found" });

    const { allergyName, description, status } = req.body;
    if (allergyName) allergy.allergyName = allergyName;
    if (description) allergy.description = description;
    if (status) allergy.status = status;

    await allergy.save();

    return res
      .status(200)
      .json({ success: true, message: "Allergy updated", allergy });
  } catch (error) {
    console.error("Update Allergy Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// SOFT DELETE ALLERGY
export const deleteAllergy = async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);
    if (!allergy)
      return res
        .status(404)
        .json({ success: false, error: "Allergy not found" });

    allergy.status = "inactive";
    await allergy.save();

    return res
      .status(200)
      .json({ success: true, message: "Allergy deactivated successfully" });
  } catch (error) {
    console.error("Delete Allergy Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
