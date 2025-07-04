const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

// In-memory database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'adminpass');");
  db.run("INSERT INTO users (username, password) VALUES ('user', 'userpass');");
  db.run("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);");
  db.run("INSERT INTO products (name) VALUES ('Widget');");
  db.run("INSERT INTO products (name) VALUES ('Gadget');");
});

app.post('/execute', (req, res) => {
  const { query, params } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: 'query required' });
  }
  db.all(query, params || [], (err, rows) => {
    if (err) {
      return res.json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
