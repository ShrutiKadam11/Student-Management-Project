
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the express app
const app = express();
const port = 3000;

// Middleware setup
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded data

// Database connection configuration
const db = mysql.createConnection({
    host: 'localhost',     
    user: 'root',     
    password: 'Sanku@20@11',  
    database: 'student_db'  
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the MySQL database.');
});

// ---- API ROUTES ---- //

// 1. GET /students - Fetch all students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// 2. POST /students - Add a new student
app.post('/students', (req, res) => {
    // Extract student data from the request body
    const { name, email, course } = req.body;

    // Basic validation
    if (!name || !email || !course) {
        return res.status(400).json({ error: 'Name, email, and course are required' });
    }

    const sql = 'INSERT INTO students (name, email, course) VALUES (?, ?, ?)';
    db.query(sql, [name, email, course], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).json({ error: 'Failed to add student' });
        }
        // Respond with the newly created student's data including the new ID
        res.status(201).json({ id: result.insertId, name, email, course });
    });
});

// 3. PUT /students/:id - Update an existing student
app.put('/students/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, email, course } = req.body;

    // Basic validation
    if (!name || !email || !course) {
        return res.status(400).json({ error: 'Name, email, and course are required' });
    }

    const sql = 'UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?';
    db.query(sql, [name, email, course, studentId], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            return res.status(500).json({ error: 'Failed to update student' });
        }
        if (result.affectedRows === 0) {
            // No student found with the given ID
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    });
});


// 4. DELETE /students/:id - Delete a student
app.delete('/students/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Failed to delete student' });
        }
        if (result.affectedRows === 0) {
            // No student found with the given ID
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
