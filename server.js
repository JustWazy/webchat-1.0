const express = require('express');
const http = require('http');

// Inisialisasi aplikasi Express
const app = express();
const server = http.createServer(app);

// Variabel untuk menyimpan semua chat
let chat = [];

// Middleware untuk menangani JSON
app.use(express.json());

// Route untuk menyajikan HTML langsung dari server
app.get('/', (req, res) => {
    res.send(`PIRDC`);
});

// Route untuk mendapatkan riwayat chat
app.get('/chat', (req, res) => {
    res.json(chat);
});

// Route untuk menerima pesan baru
app.post('/chat', (req, res) => {
    const { message } = req.body;
    if (message) {
        chat.push(message); // Simpan pesan ke variabel chat
        res.status(201).send(); // Kirim respon sukses
    } else {
        res.status(400).send('Message is required');
    }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
