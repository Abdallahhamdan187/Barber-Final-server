import express from "express";
import pgclient from "../db.js";

const userRoutes = express.Router();


// Define user-related routes here
// localhost:5000/api/users/services
userRoutes.get("/services", async (req, res) => {
    try {
        const result = await pgclient.query("SELECT * FROM barberschema.services ORDER BY service_id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/users/barbers
userRoutes.get("/barbers", async (req, res) => {
    try {
        const result = await pgclient.query("SELECT * FROM barberschema.barbers ORDER BY barber_id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/users
userRoutes.get("/", async (req, res) => {
    //fetch users from database
    try {
        const result = await pgclient.query("SELECT user_id, full_name, email, role FROM barberschema.users ORDER BY user_id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/users/:id
userRoutes.get("/:id", async (req, res) => {
    //fetch users from database
    const result = await pgclient.query("SELECT user_id, full_name, email, role FROM barberschema.users WHERE user_id = $1", [req.params.id]);
    res.json(result.rows[0]);
});




// localhost:5000/api/users/:id/appointments
userRoutes.get("/:id/appointments", async (req, res) => {
    //fetch appointment for the user from database
    const result = await pgclient.query(`SELECT 
          a.appointment_id,
 to_char(a.appt_date, 'YYYY-MM-DD') AS appt_date,
           a.appt_time,
          a.status,
          a.price_at_booking,
          s.name AS service_name,
          b.name AS barber_name
       FROM barberschema.appointments a
       JOIN barberschema.services s ON s.service_id = a.service_id
       JOIN barberschema.barbers b ON b.barber_id = a.barber_id
       WHERE a.user_id = $1
       ORDER BY a.appt_date DESC, a.appt_time DESC`,
        [req.params.id]);

    res.json(result.rows);
});

// localhost:5000/api/users/:id/appointments
userRoutes.post("/:id/appointments", async (req, res) => {
    try {
        const userId = Number(req.params.id);


        const serviceId = Number(req.body.service_id);
        const barberId = Number(req.body.barber_id);
        const { appt_date, appt_time } = req.body;


        const serviceResult = await pgclient.query(
            "SELECT price FROM barberschema.services WHERE service_id = $1",
            [serviceId]
        );

        const price_at_booking = serviceResult.rows[0].price;
        const result = await pgclient.query(
            `INSERT INTO barberschema.appointments
        (user_id, barber_id, service_id, appt_date, appt_time, status, price_at_booking)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [userId, barberId, serviceId, appt_date, appt_time, "Pending", price_at_booking]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ message: "This time slot is already booked." });
        }

        console.error("Create appointment error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/users/:userId/appointments/:appointmentId/cancel
userRoutes.put("/:userId/appointments/:appointmentId/cancel", async (req, res) => {
    //DELETE appointment from database

    try {
        const result = await pgclient.query("UPDATE barberschema.appointments SET status = $1 WHERE appointment_id=$2 AND user_id=$3 RETURNING *", ["Cancelled", req.params.appointmentId, req.params.userId]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

userRoutes.delete("/:userId/appointments/:appointmentId/Delete", async (req, res) => {
    //DELETE appointment from database

    try {
        const result = await pgclient.query("DELETE FROM barberschema.appointments WHERE appointment_id=$1 AND user_id=$2 RETURNING *", [req.params.appointmentId, req.params.userId]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});



export default userRoutes;