import WardBed from "../models/WardBed.js";

// GET ALL WARDS
export const getWards = async (req, res) => {
  try {
    const wards = await WardBed.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, wards });
  } catch (error) {
    console.error("Get Wards Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// GET WARD BY ID
export const getWardById = async (req, res) => {
  try {
    const ward = await WardBed.findById(req.params.id);
    if (!ward)
      return res.status(404).json({ success: false, error: "Ward not found" });

    return res.status(200).json({ success: true, ward });
  } catch (error) {
    console.error("Get Ward Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ADD WARD
export const addWard = async (req, res) => {
  try {
    const { ward, bed_type } = req.body;
    if (!ward || !bed_type)
      return res
        .status(400)
        .json({ success: false, error: "Ward and bed_type required" });

    const newWard = new WardBed({ ward, bed_type });
    await newWard.save();

    return res
      .status(201)
      .json({ success: true, message: "Ward added", ward: newWard });
  } catch (error) {
    console.error("Add Ward Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE WARD
export const updateWard = async (req, res) => {
  try {
    const ward = await WardBed.findById(req.params.id);
    if (!ward)
      return res.status(404).json({ success: false, error: "Ward not found" });

    const { ward: wardName, bed_type, bedStatus } = req.body;
    if (wardName) ward.ward = wardName;
    if (bed_type) ward.bed_type = bed_type;
    if (bedStatus) ward.bedStatus = bedStatus;

    await ward.save();
    return res
      .status(200)
      .json({ success: true, message: "Ward updated", ward });
  } catch (error) {
    console.error("Update Ward Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// SOFT DELETE WARD
export const deleteWard = async (req, res) => {
  try {
    const ward = await WardBed.findById(req.params.id);
    if (!ward)
      return res.status(404).json({ success: false, error: "Ward not found" });

    ward.bedStatus = "inactive";
    await ward.save();

    return res
      .status(200)
      .json({ success: true, message: "Ward deactivated successfully" });
  } catch (error) {
    console.error("Delete Ward Error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
