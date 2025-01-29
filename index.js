const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./connection");

const app = express();
const PORT = 4000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Database Connection
connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    throw err;
  }
  console.log("Connected to database");

  // Create the `student` table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS student (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      cont VARCHAR(15),
      address VARCHAR(255)
    )
  `;
  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
      throw err;
    }
    console.log("Student table is ready!");
  });
});

// Routes
// Get all students
app.get("/students", (req, res) => {
  connection.query("SELECT * FROM student", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching students");
    } else {
      res.send(rows);
    }
  });
});

// Get student by ID
app.get("/students/:id", (req, res) => {
  connection.query(
    "SELECT * FROM student WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching student");
      } else {
        res.send(rows);
      }
    }
  );
});

// Insert a new student
app.post("/students", (req, res) => {
  const { id, name, cont, address } = req.body;
  const query = "INSERT INTO student (id, name, cont, address) VALUES (?)";
  const values = [id, name, cont, address];

  connection.query(query, [values], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting student");
    } else {
      res.send(rows);
    }
  });
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  connection.query(
    "DELETE FROM student WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting student");
      } else {
        res.send(rows);
      }
    }
  );
});

// Update student (PATCH)
app.patch("/students", (req, res) => {
  const { id, ...updatedFields } = req.body;
  connection.query(
    "UPDATE student SET ? WHERE id = ?",
    [updatedFields, id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating student");
      } else {
        res.send(rows);
      }
    }
  );
});

// Update or Insert student (PUT)
app.put("/students", (req, res) => {
  const { id, name, cont, address } = req.body;
  const query = "UPDATE student SET ? WHERE id = ?";
  const newStudentQuery =
    "INSERT INTO student (id, name, cont, address) VALUES (?)";
  const values = [id, name, cont, address];

  connection.query(query, [{ name, cont, address }, id], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating student");
    } else {
      if (rows.affectedRows === 0) {
        // If no rows were updated, insert a new record
        connection.query(newStudentQuery, [values], (insertErr, insertRows) => {
          if (insertErr) {
            console.error(insertErr);
            res.status(500).send("Error inserting new student");
          } else {
            res.send(insertRows);
          }
        });
      } else {
        res.send(rows);
      }
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
