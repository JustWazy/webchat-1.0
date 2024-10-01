const express = require('express');
const http = require('http');
const express = require('express');
const app = express();

// Port di mana server akan berjalan
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Route dasar di root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route contoh lainnya
app.get('/about', (req, res) => {
  res.send('Ini halaman tentang.');
});

// Route POST untuk menerima data
app.post('/submit', (req, res) => {
  const data = req.body;
  res.send(`Data diterima: ${JSON.stringify(data)}`);
});

// Jalankan server di port yang ditentukan
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

