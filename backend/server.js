const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Connect to local MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'levaku@2000',
  database: 'contact_form_db' // ✅ Ensure this DB exists in your local MySQL
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to MySQL:', err);
  } else {
    console.log('✅ Connected to local MySQL');
  }
});

// 👉 POST /signup - Save signup form data to MySQL
app.post('/signup', (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  // Validation
  if (!fullname || !email || !password || !confirmPassword) {
    return res.status(400).send('All fields are required');
  }

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  const sql = 'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)';
  db.query(sql, [fullname, email, password], (err, result) => {
    if (err) {
      console.error('❌ Error inserting user:', err);
      return res.status(500).send('Database error');
    }
    res.send('✅ Signup successful');
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
