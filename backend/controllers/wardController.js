import WardBed from "../models/WardBed.js";

// GET ALL BEDS
export const getBeds = async (req, res) => {
  try {
    const beds = await WardBed.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, beds });
  } catch (error) {
    console.error("Get Beds Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Fetching beds server error" });
  }
};

// ⭐ NEW — GET BED BY ID
export const getBedById = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await WardBed.findById(id);

    if (!bed) {
      return res.status(404).json({ success: false, error: "Bed not found" });
    }

    return res.status(200).json({ success: true, bed });
  } catch (error) {
    console.error("Get Bed Error:", error);
    return res.status(500).json({
      success: false,
      error: "Fetching bed failed",
    });
  }
};

// ADD NEW BED
export const addBed = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log incoming data

    const { bed_type, ward, bedStatus } = req.body;

    if (!bed_type || !ward) {
      return res
        .status(400)
        .json({ success: false, error: "Bed Type and Ward are required" });
    }

    const newBed = new WardBed({
      bed_type,
      ward,
      bedStatus: bedStatus || "available",
    });

    await newBed.save();
    return res
      .status(201)
      .json({ success: true, message: "Bed added successfully", bed: newBed });
  } catch (error) {
    console.error("Add Bed Error:", error); // Show full Mongoose error
    return res.status(500).json({
      success: false,
      error: "Adding bed server error",
      details: error.message,
    });
  }
};

// UPDATE BED
export const updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { bed_type, ward, bedStatus } = req.body;

    const bed = await WardBed.findById(id);
    if (!bed)
      return res.status(404).json({ success: false, error: "Bed not found" });

    if (bed_type) bed.bed_type = bed_type;
    if (ward) bed.ward = ward;
    if (bedStatus) bed.bedStatus = bedStatus;

    await bed.save();
    return res
      .status(200)
      .json({ success: true, message: "Bed updated successfully", bed });
  } catch (error) {
    console.error("Update Bed Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Updating bed server error" });
  }
};

// DELETE BED
export const deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    const bed = await WardBed.findById(id);
    if (!bed)
      return res.status(404).json({ success: false, error: "Bed not found" });

    await WardBed.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Bed deleted successfully" });
  } catch (error) {
    console.error("Delete Bed Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Deleting bed server error" });
  }
};
