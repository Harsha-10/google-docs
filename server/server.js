import { Server } from "socket.io";
import connect from "./db/database.js";
import Document from "./schema/schema.js";
import express from "express";
import { createServer } from "http";
import path from "path";
require('dotenv').config();
const cors = require("cors");
const path = require('path');
const app = express();
app.use(cors());
const httpServer = createServer(app);
const url =process.env.MONGODB_URI || "mongodb+srv://docsuser:docsuser123@cluster0.lb8gg2f.mongodb.net/google-docs?retryWrites=true&w=majority";
connect(url);

const __dirname1 = path.resolve();
if(process.env.NODE_ENV=== 'production'){
    app.use(express.static(path.join(__dirname1,"client/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname1,"client/build","build","index.html"))
    })
}else{
    app.get("/",(req,res)=>{
        res.send("API running successfully");
    })
}
const PORT = process.env.PORT || 9000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const io = new Server(httpServer, {
    cors: {
        origin: "https://google-docs-ylsh.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
    },
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
