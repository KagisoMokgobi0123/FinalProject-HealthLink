import User from "../models/User.js";
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ success: false, error: "incorrect login details" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(404)
        .json({ success: false, error: "Incorrect login details" });
    }
    const token = JsonWebTokenError.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );
    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.log(error.message);
  }
};
export { login };
