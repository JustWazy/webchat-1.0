const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Inisialisasi aplikasi Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Variabel untuk menyimpan semua chat
let chat = [];

// Menyajikan file statis (HTML, CSS, dll.)
app.use(express.static(__dirname + '/public'));

// Ketika client terhubung
io.on('connection', (socket) => {
    console.log('User connected');

    // Kirim riwayat chat saat user bergabung
    socket.emit('chat history', chat);

    // Terima pesan baru dari client
    socket.on('new message', (message) => {
        // Simpan pesan ke variabel chat
        chat.push(message);

        // Broadcast pesan ke semua client
        io.emit('new message', message);
    });

    // Ketika client terputus
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
