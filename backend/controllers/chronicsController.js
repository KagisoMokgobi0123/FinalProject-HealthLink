import ChronicCondition from "../models/Chronics.js";

// GET ALL CHRONIC CONDITIONS
export const getChronics = async (req, res) => {
  try {
    const chronics = await ChronicCondition.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, chronics });
  } catch (error) {
    console.error("Get Chronics Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching chronic conditions server error",
    });
  }
};

// GET CHRONIC CONDITION BY ID
export const getChronicById = async (req, res) => {
  try {
    const { id } = req.params;
    const chronic = await ChronicCondition.findById(id);

    if (!chronic) {
      return res
        .status(404)
        .json({ success: false, error: "Chronic condition not found" });
    }

    return res.status(200).json({ success: true, chronic });
  } catch (error) {
    console.error("Get Chronic Condition Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching chronic condition failed",
    });
  }
};

// ADD NEW CHRONIC CONDITION
export const addChronic = async (req, res) => {
  try {
    const { chronicName, description, status } = req.body;

    // Validate required fields: chronicName and description
    if (!chronicName || !description) {
      return res.status(400).json({
        success: false,
        error: "Chronic name and description are required",
      });
    }

    // Default status to "Active" if not provided
    const newChronic = new ChronicCondition({
      chronicName,
      description,
      status: status || "Active", // Default to "Active" if no status provided
    });

    await newChronic.save();
    return res.status(201).json({
      success: true,
      message: "Chronic condition added successfully",
      chronic: newChronic,
    });
  } catch (error) {
    console.error("Add Chronic Condition Error:", error);
    return res.status(500).json({
      success: false,
      error: "Adding chronic condition server error",
      details: error.message,
    });
  }
};

// UPDATE CHRONIC CONDITION
export const updateChronic = async (req, res) => {
  try {
    const { id } = req.params;
    const { chronicName, description, status } = req.body;

    const existingChronic = await ChronicCondition.findById(id);
    if (!existingChronic)
      return res
        .status(404)
        .json({ success: false, error: "Chronic condition not found" });

    // Update fields if they exist in the request body
    if (chronicName) existingChronic.chronicName = chronicName;
    if (description) existingChronic.description = description;
    if (status) existingChronic.status = status;

    await existingChronic.save();
    return res.status(200).json({
      success: true,
      message: "Chronic condition updated successfully",
      chronic: existingChronic,
    });
  } catch (error) {
    console.error("Update Chronic Condition Error:", error);
    return res.status(500).json({
      success: false,
      error: "Updating chronic condition server error",
    });
  }
};

// DELETE CHRONIC CONDITION
export const deleteChronic = async (req, res) => {
  try {
    const { id } = req.params;

    const chronic = await ChronicCondition.findById(id);
    if (!chronic)
      return res
        .status(404)
        .json({ success: false, error: "Chronic condition not found" });

    await ChronicCondition.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Chronic condition deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chronic Condition Error:", error);
    return res.status(500).json({
      success: false,
      error: "Deleting chronic condition server error",
    });
  }
};
