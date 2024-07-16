import { useContext, useEffect, useState } from "react";
import classes from "../styles/drawing-room.module.css";
import { useDraw } from "../hooks/useDraw";
import { CirclePicker } from "react-color";
import { MdSend } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import socket from "../utils/socket";
import { v4 as uuidV4 } from "uuid";

const DrawingRoom = () => {
  const { username } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { roomId } = useParams();
  const { canvasRef, setColor } = useDraw(roomId);

  const navigate = useNavigate();

  useEffect(() => {
    if (username === "") {
      navigate(`/onboarding/${roomId}`);
    } else {
      socket.emit("room:join", { roomId, username });

      socket.on("player:join", (player) => {
        const adminMessage = {
          id: uuidV4(),
          message: `${player.username} just entered your world!`,
          username: "system",
        };
        setMessages((prev) => [...prev, adminMessage]);
      });

      socket.on("message:new", (data) => {
        const message = messages.find((message) => message.id === data.id);
        if (message) return;
        setMessages((prev) => [...prev, data]);
      });

      socket.on("player:left", (username) => {
        const adminMessage = {
          id: uuidV4(),
          message: `${username} just left your world :(`,
          username: "system",
        };
        setMessages((prev) => [...prev, adminMessage]);
      });
    }

    const handleBeforeUnload = () => {
      socket.emit("player:leave", { roomId, playerId: socket.id, username });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [username]);

  function handleSubmit(e) {
    e.preventDefault();
    setText("");
    socket.emit("message:send", { roomId, message: text, username });
  }

  return (
    <div className={classes.drawingRoom}>
      <h1>Let your creativity flow!</h1>
      <div className={classes.game}>
        <div className={classes.gameBoard}>
          <CirclePicker
            className={classes.colorPicker}
            onChange={(color) => setColor(color.hex)}
          />
          <canvas
            ref={canvasRef}
            width="700"
            height="500"
            className={classes.canvas}
          />
        </div>
        <div className={classes.chat_box}>
          {messages.map((message) => (
            <div className={classes.message} key={message.id}>
              <p>{message.username}:</p>
              <h4>{message.message}</h4>
            </div>
          ))}
          <form className={classes.send_message}>
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              type="submit"
            >
              <MdSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DrawingRoom;
