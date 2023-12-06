import { Server } from "socket.io";
import connect from "./db/database.js";
import Document from "./schema/schema.js";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://google-docs-virid.vercel.app", // Replace with the actual origin of your frontend app
    methods: ["GET", "POST"],
  },
});

const url = process.env.MONGODB_URI || "mongodb+srv://docsuser:docsuser123@cluster0.lb8gg2f.mongodb.net/google-docs?retryWrites=true&w=majority";
connect(url);

app.use(cors());

// Middleware to check the JWT token
app.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    
    // Attach user information to the socket
    socket.user = decoded.user;
    next();
  });
});

const PORT = process.env.PORT || 9000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', socket => {
  // You can access the user information via socket.user now
  console.log(`User connected: ${socket.user}`);

  socket.on('get-doc', async documentID => {
    const doc = await getDocument(documentID);
    socket.join(documentID);
    socket.emit('load-doc', doc.data);
    console.log(doc);

    socket.on('send-changes', delta => {
      socket.broadcast.to(documentID).emit('receive-changes', delta);
    });

    socket.on('save', async newData => {
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
