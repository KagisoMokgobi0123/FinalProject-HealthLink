export default function adminMiddleware(req, res, next) {
  if (req.user.roleName !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied" });
  }
  next();
}
