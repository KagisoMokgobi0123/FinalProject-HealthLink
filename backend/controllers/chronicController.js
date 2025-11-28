import ChronicCondition from "../models/Chronics.js";

// GET ALL CHRONIC CONDITIONS
export const getChronics = async (req, res) => {
  try {
    const chronics = await ChronicCondition.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, chronics });
  } catch (error) {
    console.error("Get Chronics Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET CHRONIC BY ID
export const getChronicById = async (req, res) => {
  try {
    const chronic = await ChronicCondition.findById(req.params.id);
    if (!chronic)
      return res.status(404).json({
        success: false,
        error: "Chronic condition not found",
      });

    return res.status(200).json({ success: true, chronic });
  } catch (error) {
    console.error("Get Chronic Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ADD CHRONIC CONDITION
export const addChronic = async (req, res) => {
  try {
    const { chronicName, description } = req.body;

    if (!chronicName || !description)
      return res.status(400).json({
        success: false,
        error: "Name and description required",
      });

    const newChronic = new ChronicCondition({ chronicName, description });
    await newChronic.save();

    return res.status(201).json({
      success: true,
      message: "Chronic condition added",
      chronic: newChronic,
    });
  } catch (error) {
    console.error("Add Chronic Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE CHRONIC CONDITION
export const updateChronic = async (req, res) => {
  try {
    const chronic = await ChronicCondition.findById(req.params.id);
    if (!chronic)
      return res.status(404).json({
        success: false,
        error: "Chronic condition not found",
      });

    const { chronicName, description, status } = req.body;
    if (chronicName) chronic.chronicName = chronicName;
    if (description) chronic.description = description;
    if (status) chronic.status = status;

    await chronic.save();

    return res.status(200).json({
      success: true,
      message: "Chronic condition updated",
      chronic,
    });
  } catch (error) {
    console.error("Update Chronic Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// SOFT DELETE CHRONIC CONDITION
export const deleteChronic = async (req, res) => {
  try {
    const chronic = await ChronicCondition.findById(req.params.id);
    if (!chronic)
      return res.status(404).json({
        success: false,
        error: "Chronic condition not found",
      });

    chronic.status = "Inactive";
    await chronic.save();

    return res.status(200).json({
      success: true,
      message: "Chronic condition deactivated successfully",
    });
  } catch (error) {
    console.error("Delete Chronic Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
