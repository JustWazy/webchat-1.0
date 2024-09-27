const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Inisialisasi aplikasi Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Variabel untuk menyimpan semua chat
let chat = [];

// Route untuk menyajikan HTML langsung dari server
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Real-Time Chat</title>
        <style>
            body { font-family: Arial, sans-serif; }
            #chat { max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; }
            #chat p { margin: 0; padding: 5px; }
            #message { width: 80%; padding: 10px; }
            #send { padding: 10px; }
        </style>
    </head>
    <body>
        <h1>Real-Time Chat</h1>
        <div id="chat"></div>
        <input type="text" id="message" placeholder="Type your message">
        <button id="send">Send</button>

        <script src="/socket.io/socket.io.js"></script>
        <script>
            const socket = io();

            // Menampilkan riwayat chat
            socket.on('chat history', (chatHistory) => {
                const chatDiv = document.getElementById('chat');
                chatHistory.forEach((msg) => {
                    const p = document.createElement('p');
                    p.textContent = msg;
                    chatDiv.appendChild(p);
                });
            });

            // Menampilkan pesan baru
            socket.on('new message', (message) => {
                const chatDiv = document.getElementById('chat');
                const p = document.createElement('p');
                p.textContent = message;
                chatDiv.appendChild(p);
            });

            // Mengirim pesan baru
            document.getElementById('send').addEventListener('click', () => {
                const messageInput = document.getElementById('message');
                const message = messageInput.value;
                if (message) {
                    socket.emit('new message', message);
                    messageInput.value = '';
                }
            });
        </script>
    </body>
    </html>
    `);
});

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
