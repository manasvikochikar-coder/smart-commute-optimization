const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'transport_db'
});

// Fetch bus routes based on priority
app.get('/bus-routes', (req, res) => {
    const { priority } = req.query;

    let query = "SELECT * FROM bus_routes ORDER BY eta ASC"; // default shortest time

    if (priority === "cheap") query = "SELECT * FROM bus_routes ORDER BY cost ASC";
    if (priority === "comfort") query = "SELECT * FROM bus_routes ORDER BY comfort_level DESC";
    if (priority === "eco") query = "SELECT * FROM bus_routes ORDER BY eco_rating DESC";
    if (priority === "short") query = "SELECT * FROM bus_routes ORDER BY eta ASC";

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
