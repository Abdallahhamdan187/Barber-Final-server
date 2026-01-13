import express from "express";
import pgclient from "../db.js";
const authRoutes = express.Router();
// Define authentication-related routes here

// localhost:5000/api/auth/login
authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pgclient.query("SELECT user_id, full_name, email, role FROM barberschema.users WHERE email = $1 AND password = $2", [email, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});
// localhost:5000/api/auth/signup
authRoutes.post("/signup", async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        const existingUser = await pgclient.query("SELECT * FROM barberschema.users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already used" });
        }
        const result = await pgclient.query("INSERT INTO barberschema.users (full_name, email, password, role) VALUES ($1, $2, $3, 'user') RETURNING user_id, full_name, email, role",
            [full_name, email, password]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


export default authRoutes;