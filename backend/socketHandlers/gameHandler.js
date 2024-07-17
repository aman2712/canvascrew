/**
 * A function to handle all game related socket events
 * @param {*} io
 * @param {*} socket
 */
export default function gameHandler(io, socket) {
  const transferImage = (payload) => {
    const { roomId, data } = payload;
    io.in(roomId).emit("image", data);
  };

  socket.on("canvas:image", transferImage);
}
