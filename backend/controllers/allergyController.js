import Allergy from "../models/Allergy.js";

// GET ALL ALLERGIES
export const getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, allergies });
  } catch (error) {
    console.error("Get Allergies Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching allergies server error",
    });
  }
};

// GET ALLERGY BY ID
export const getAllergyById = async (req, res) => {
  try {
    const { id } = req.params;
    const allergy = await Allergy.findById(id);

    if (!allergy) {
      return res
        .status(404)
        .json({ success: false, error: "Allergy not found" });
    }

    return res.status(200).json({ success: true, allergy });
  } catch (error) {
    console.error("Get Allergy Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching allergy failed",
    });
  }
};

// ADD NEW ALLERGY
export const addAllergy = async (req, res) => {
  try {
    const { allergyName, description, status } = req.body;

    // Validate required fields: allergyName and description
    if (!allergyName || !description) {
      return res.status(400).json({
        success: false,
        error: "Allergy name and description are required",
      });
    }

    // Default status to "active" if not provided
    const newAllergy = new Allergy({
      allergyName,
      description,
      status: status || "active", // Default to "active" if no status provided
    });

    await newAllergy.save();
    return res.status(201).json({
      success: true,
      message: "Allergy added successfully",
      allergy: newAllergy,
    });
  } catch (error) {
    console.error("Add Allergy Error:", error);
    return res.status(500).json({
      success: false,
      error: "Adding allergy server error",
      details: error.message,
    });
  }
};

// UPDATE ALLERGY
export const updateAllergy = async (req, res) => {
  try {
    const { id } = req.params;
    const { allergyName, description, status } = req.body;

    const existingAllergy = await Allergy.findById(id);
    if (!existingAllergy)
      return res
        .status(404)
        .json({ success: false, error: "Allergy not found" });

    // Update fields if they exist in the request body
    if (allergyName) existingAllergy.allergyName = allergyName;
    if (description) existingAllergy.description = description;
    if (status) existingAllergy.status = status;

    await existingAllergy.save();
    return res.status(200).json({
      success: true,
      message: "Allergy updated successfully",
      allergy: existingAllergy,
    });
  } catch (error) {
    console.error("Update Allergy Error:", error);
    return res.status(500).json({
      success: false,
      error: "Updating allergy server error",
    });
  }
};

// DELETE ALLERGY
export const deleteAllergy = async (req, res) => {
  try {
    const { id } = req.params;

    const allergy = await Allergy.findById(id);
    if (!allergy)
      return res
        .status(404)
        .json({ success: false, error: "Allergy not found" });

    await Allergy.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Allergy deleted successfully",
    });
  } catch (error) {
    console.error("Delete Allergy Error:", error);
    return res.status(500).json({
      success: false,
      error: "Deleting allergy server error",
    });
  }
};
