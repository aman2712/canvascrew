import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { rooms } from "./socketHandlers/roomHandler.js";

import registerGameHandlers from "./socketHandlers/gameHandler.js";
import registerRoomHandlers from "./socketHandlers/roomHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onConnection = (socket) => {
  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket);
};

// an api route to get all public rooms created
app.get("/public-rooms", (req, res) => {
  const public_rooms = [];
  for (const room in rooms) {
    if (rooms.hasOwnProperty(room)) {
      if (rooms[room].room_type === "public") {
        public_rooms.push(rooms[room]);
      }
    }
  }
  res.json(public_rooms);
});

io.on("connection", onConnection);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
