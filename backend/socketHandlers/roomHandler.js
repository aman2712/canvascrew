import { v4 as uuidv4 } from "uuid";

export const rooms = {};

export default function roomHandler(io, socket) {
  const createRoom = (payload) => {
    const { room_name, room_type, max_players, username } = payload;
    const roomId = uuidv4();

    rooms[roomId] = {
      id: roomId,
      room_name,
      room_type,
      max_players,
      players: [],
      creator_name: username,
    };

    socket.emit("room:created", roomId);
  };

  const joinRoom = (payload) => {
    const { roomId, username } = payload;

    const room = rooms.hasOwnProperty(roomId);
    if (!room) return;

    const player = {
      id: socket.id,
      username,
    };

    rooms[roomId].players.push(player);

    socket.join(roomId);
    socket.to(roomId).emit("player:join", player);
  };

  const transferMessage = (payload) => {
    const { roomId, message, username } = payload;

    const room = rooms.hasOwnProperty(roomId);
    if (!room) return;

    io.in(roomId).emit("message:new", { username, message, id: uuidv4() });
  };

  const removePlayer = (payload) => {
    const { roomId, playerId, username } = payload;

    const room = rooms.hasOwnProperty(roomId);
    if (!room) return;

    rooms[roomId].players = rooms[roomId].players.filter(
      (player) => player.id !== playerId
    );

    socket.leave(playerId);
    io.in(roomId).emit("player:left", username);
  };

  setInterval(() => {
    for (let roomId in rooms) {
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    }
  }, 60000);

  socket.on("room:create", createRoom);
  socket.on("room:join", joinRoom);
  socket.on("message:send", transferMessage);
  socket.on("player:leave", removePlayer);
}
