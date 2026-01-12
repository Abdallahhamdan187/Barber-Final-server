import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pgclient from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
const app = express();//use all the methods of express

dotenv.config();
const port = process.env.Port;

//middeleware
app.use(cors());//open to all origins
app.use(express.json());//to parse json body
//app.use(cors({ origin: "localhost:5173" }));//only allow my react app to access the server


//conect to database then start the server
pgclient.connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});


//Localhost:5000/api/users
app.use("/api/users", userRoutes);

//Localhost:5000/api/auth
app.use("/api/auth", authRoutes);

//Localhost:5000/api/admin
app.use("/api/admin", adminRoutes);

//404 route
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});