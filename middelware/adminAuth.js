export default function adminAuth(req, res, next) {
    const role = String(req.headers["x-role"] || "").trim().toLowerCase();

    if (role === "admin") return next();

    return res.status(403).json({ message: "Admin access only" });
}