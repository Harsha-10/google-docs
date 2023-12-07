import { Server } from "socket.io";
import connect from "./db/database.js";
import Document from "./schema/schema.js";
import express from "express";
import { createServer } from "http";
require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);
const url =process.env.MONGODB_URI || "mongodb+srv://docsuser:docsuser123@cluster0.lb8gg2f.mongodb.net/google-docs?retryWrites=true&w=majority";
connect(url);

const PORT = process.env.PORT || 9000;
const io = new Server(httpServer, {
    cors: {
        origin: "https://google-docs-virid.vercel.app",
        credentials: true
    },
});
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
io.on('connection', (socket) => {
    socket.on('get-doc', async (documentID) => {
        const doc = await getDocument(documentID);
        socket.join(documentID);
        socket.emit('load-doc', doc.data);
        console.log(doc);

        socket.on('send-changes', (delta) => {
        socket.broadcast.to(documentID).emit('recieve-changes', delta);
        });

        socket.on('save', async (newData) => {
        try {
            await Document.findByIdAndUpdate(documentID, { data: newData });
        } catch (error) {
            console.error("Error saving document:", error);
        }
        });
    });
    });

    const getDocument = async (id) => {
    if (id == null) return;
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: "" });
    };
