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

        <script>
            // Fungsi untuk mendapatkan chat history
            function fetchChat() {
                fetch('/chat')
                    .then(response => response.json())
                    .then(data => {
                        const chatDiv = document.getElementById('chat');
                        chatDiv.innerHTML = ''; // Kosongkan chat sebelum diisi
                        data.forEach((msg) => {
                            const p = document.createElement('p');
                            p.textContent = msg;
                            chatDiv.appendChild(p);
                        });
                    });
            }

            // Mengambil chat setiap 2 detik
            setInterval(fetchChat, 2000);

            // Mengirim pesan baru
            document.getElementById('send').addEventListener('click', () => {
                const messageInput = document.getElementById('message');
                const message = messageInput.value;
                if (message) {
                    fetch('/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message })
                    }).then(() => {
                        messageInput.value = ''; // Kosongkan input setelah mengirim pesan
                        fetchChat(); // Update chat segera setelah mengirim pesan
                    });
                }
            });

            // Muat chat history saat halaman pertama kali dimuat
            fetchChat();
        </script>
    </body>
    </html>
    `);
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
