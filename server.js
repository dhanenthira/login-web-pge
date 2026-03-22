const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "loginDB"
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});


// 📝 REGISTER
app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, phone, hashedPassword], (err, result) => {
    if (err) {
      return res.send("User already exists ❌");
    }
    res.send("Registration Successful ✅");
  });
});


// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.send("Error");

    if (result.length === 0) {
      return res.send("User not found ❌");
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.send("Login Success ✅");
    } else {
      res.send("Wrong Password ❌");
    }
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));