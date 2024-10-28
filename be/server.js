const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

app.use(cors()); 
app.use(express.json()); 

const CHAT_FILE = 'chat.json';

// Fungsi untuk menyimpan chat
app.post('/api/chat', (req, res) => {
    const { user, chat } = req.body;

    if (!user || !chat) {
        return res.status(400).json({ message: 'User dan chat diperlukan' });
    }

    fs.readFile(CHAT_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Gagal membaca file chat' });

        const chats = JSON.parse(data || '[]');
        chats.push(`${user}: ${chat}`);

        fs.writeFile(CHAT_FILE, JSON.stringify(chats, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Gagal menyimpan chat' });

            res.status(201).json({ message: 'Chat berhasil disimpan' });
        });
    });
});

// Fungsi untuk mengambil chat
app.get('/api/chat', (req, res) => {
    fs.readFile(CHAT_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Gagal membaca file chat' });

        const chats = JSON.parse(data || '[]');
        res.json(chats);
    });
});

// Set port nya disini
const PORT = 25575;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
