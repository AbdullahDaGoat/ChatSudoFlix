import { createServer } from 'http';
import { Server } from 'socket.io';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// Get current directory
const __dirname = path.resolve();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const db = new Database('database.sqlite');

function initDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            content TEXT,
            user_id TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

initDatabase();

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.REACT_APP_PASSWORD) {
        return res.json({ success: true });
    }
    return res.json({ success: false });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (data) => {
        socket.join(data.room);
        const recentMessages = db.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50').all();
        socket.emit('recentMessages', recentMessages);
        socket.to(data.room).emit('message', { type: 'status', content: 'A user has joined the room.' });
    });

    socket.on('message', (msg) => {
        const stmt = db.prepare('INSERT INTO messages (type, content, user_id) VALUES (?, ?, ?)');
        try {
            stmt.run('text', msg, socket.id);
        } catch (error) {
            console.error('Database insert error:', error);
        }
        io.emit('message', { type: 'text', content: msg, user_id: socket.id });
    });

    socket.on('upload', (data) => {
        const { filename, buffer } = data;
        const filePath = path.join(__dirname, 'uploads', filename);
        
        const base64Data = buffer.split(',')[1];
        const fileBuffer = Buffer.from(base64Data, 'base64');
    
        fs.writeFile(filePath, fileBuffer, (err) => {
            if (err) {
                console.error('File upload error:', err);
                socket.emit('uploadError', 'Error uploading file');
            } else {
                const fileType = filename.split('.').pop().toLowerCase();
                let messageType = 'file';
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) messageType = 'image';
                else if (['mp3', 'wav', 'ogg'].includes(fileType)) messageType = 'audio';
                else if (['mp4', 'webm', 'ogg'].includes(fileType)) messageType = 'video';
    
                const stmt = db.prepare('INSERT INTO messages (type, content, user_id) VALUES (?, ?, ?)');
                try {
                    stmt.run(messageType, filename, socket.id);
                } catch (error) {
                    console.error('Database insert error:', error);
                }
                io.emit('message', { type: messageType, content: filename, user_id: socket.id });
                socket.emit('uploadSuccess', 'File uploaded successfully');
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
