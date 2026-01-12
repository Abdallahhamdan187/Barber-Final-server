import express from "express";
import pgClient from "../db.js";
import adminAuth from "../middelware/adminAuth.js";
const adminRoutes = express.Router();


// localhost:5000/api/admin/dashboard/stats
adminRoutes.get("/dashboard/stats", adminAuth, async (req, res) => {
    try {
        const totalappontment = await pgClient.query("SELECT COUNT(*) ::int as total FROM barberschema.appointments");
        const tadaysappontment = await pgClient.query("SELECT COUNT(*) ::int as total FROM barberschema.appointments where appt_date = CURRENT_DATE");
        const activeusers = await pgClient.query("SELECT COUNT(*) ::int as total FROM barberschema.users where role='user'");
        const activebarbers = await pgClient.query("SELECT COUNT(*)::int as total FROM barberschema.barbers WHERE is_active = true");

        res.json({
            totalappontment: totalappontment.rows[0].total,
            tadaysappontment: tadaysappontment.rows[0].total,
            activeusers: activeusers.rows[0].total,
            activebarbers: activebarbers.rows[0].total,

        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});

// localhost:5000/api/admin/appointments
adminRoutes.get("/appointments", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query(`SELECT 
          a.appointment_id,
           to_char(a.appt_date, 'YYYY-MM-DD') AS appt_date,
          a.appt_time,
          a.status,
          a.price_at_booking,
          u.full_name AS customer,
          s.name AS service,
          b.name AS barber
       FROM barberschema.appointments a
       JOIN barberschema.users u ON u.user_id = a.user_id
       JOIN barberschema.services s ON s.service_id = a.service_id
       JOIN barberschema.barbers b ON b.barber_id = a.barber_id
       ORDER BY a.appt_date DESC, a.appt_time DESC`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});

// localhost:5000/api/admin/appointments/:id/approve
adminRoutes.put("/appointments/:id/approve", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("UPDATE barberschema.appointments SET status = $1 WHERE appointment_id = $2 RETURNING *", ["Approved", req.params.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/admin/appointments/:id/reject
adminRoutes.put("/appointments/:id/reject", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("UPDATE barberschema.appointments SET status = $1 WHERE appointment_id = $2 RETURNING *", ["Rejected", req.params.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/appointments/:id/complete
adminRoutes.put("/appointments/:id/complete", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query(
            "UPDATE barberschema.appointments SET status = $1 WHERE appointment_id = $2 RETURNING *",
            ["Completed", req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/appointments/:id
adminRoutes.delete("/appointments/:id", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query(
            "DELETE FROM barberschema.appointments WHERE appointment_id = $1 RETURNING *",
            [req.params.id]
        );
        res.json({ message: "Appointment deleted", appointment: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/services
adminRoutes.get("/services", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("SELECT * FROM barberschema.services ORDER BY service_id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/services

// body { name, description, price, duration_min }
adminRoutes.post("/services", adminAuth, async (req, res) => {
    const { name, description, price, duration_min } = req.body;
    try {

        const result = await pgClient.query("INSERT INTO barberschema.services (name, description, price, duration_min, is_active) VALUES ($1, $2, $3, $4, true) RETURNING *",
            [name, description || null, price, duration_min]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/admin/services/:id
adminRoutes.put("/services/:id", adminAuth, async (req, res) => {
    const { name, description, price, duration_min, is_active } = req.body;
    try {
        const result = await pgClient.query("UPDATE barberschema.services SET name=$1, description=$2, price=$3, duration_min=$4, is_active=$5 WHERE service_id=$6 RETURNING *",
            [name, description || null, price, duration_min, is_active ?? true, req.params.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/admin/services/:id
adminRoutes.delete("/services/:id", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("DELETE FROM barberschema.services WHERE service_id = $1 RETURNING *", [req.params.id]);
        res.json({ message: "Service deleted", service: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});

// localhost:5000/api/admin/barbers
adminRoutes.get("/barbers", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("SELECT * FROM barberschema.barbers ORDER BY barber_id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/admin/barbers
// body { name, specialization, working_hours, phone }
adminRoutes.post("/barbers", adminAuth, async (req, res) => {
    const { name, specialization, working_hours, phone } = req.body;
    try {
        const result = await pgClient.query("INSERT INTO barberschema.barbers (name, specialization, working_hours, phone, is_active) VALUES ($1, $2, $3, $4, true) RETURNING *",
            [name, specialization, working_hours, phone]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/barbers/:id
adminRoutes.put("/barbers/:id", adminAuth, async (req, res) => {
    const { name, specialization, working_hours, phone, is_active } = req.body;
    try {
        const result = await pgClient.query("UPDATE barberschema.barbers SET name=$1, specialization=$2, working_hours=$3, phone=$4, is_active=$5 WHERE barber_id=$6 RETURNING *",
            [name, specialization, working_hours, phone, is_active ?? true, req.params.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// localhost:5000/api/admin/barbers/:id 
adminRoutes.delete("/barbers/:id", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("DELETE FROM barberschema.barbers WHERE barber_id = $1 RETURNING *", [req.params.id]);
        res.json({ message: "Barber deleted", barber: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/users/
adminRoutes.get("/users", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query("SELECT user_id, full_name, email, role FROM barberschema.users ORDER BY user_id DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// localhost:5000/api/admin/users/:id
adminRoutes.delete("/users/:id", adminAuth, async (req, res) => {
    try {
        const result = await pgClient.query(
            "DELETE FROM barberschema.users WHERE user_id = $1 RETURNING user_id, full_name, email, role",
            [req.params.id]
        );
        res.json({ message: "User deleted", user: result.rows[0] });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
export default adminRoutes;