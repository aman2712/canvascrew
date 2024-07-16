import classes from "../styles/create-room.module.css";
import { Link } from "react-router-dom";
import {
  FaArrowLeftLong,
  FaPlus,
  FaMinus,
  FaArrowRightLong,
} from "react-icons/fa6";
import { useState, useEffect, useContext } from "react";
import socket from "../utils/socket";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const CreateRoom = () => {
  const { setUsername } = useContext(AppContext);
  const [data, setData] = useState({
    room_type: "private",
    max_players: 3,
    room_name: "",
    username: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const changePlayers = (action) => {
    if (action === "increase") {
      if (data.max_players === 10) return;
      setData({ ...data, max_players: data.max_players + 1 });
    } else if (action === "decrease") {
      if (data.max_players === 1) return;
      setData({ ...data, max_players: data.max_players - 1 });
    }
  };

  function handleSubmit() {
    setMessage("");
    if (data.room_name === "" || data.username === "") {
      setMessage("Please fill all the fields");
      return;
    }
    setUsername(data.username);
    socket.emit("room:create", data);
  }

  useEffect(() => {
    socket.on("room:created", (roomId) => {
      navigate(`/game/${roomId}`);
    });
  }, []);

  return (
    <div className={classes.create_room}>
      <Link to="/">
        <FaArrowLeftLong /> Back to Home
      </Link>
      <h2 className={classes.heading}>Create your very own hangout spot!</h2>
      <div className={classes.form}>
        <h2>Room Details</h2>
        {message.length > 0 && (
          <p className={classes.errorMessage}>{message}</p>
        )}
        <div className={classes.option_container}>
          <div className={classes.options}>
            <button
              className={`btn btn-secondary ${
                data.room_type === "private" && classes.active
              }`}
              onClick={() => setData({ ...data, room_type: "private" })}
            >
              Private
            </button>
            <button
              className={`btn btn-secondary ${
                data.room_type === "public" && classes.active
              }`}
              onClick={() => setData({ ...data, room_type: "public" })}
            >
              Public
            </button>
          </div>
          <div className={classes.players}>
            <FaMinus size={15} onClick={() => changePlayers("decrease")} />
            <p>{data.max_players}</p>
            <FaPlus size={15} onClick={() => changePlayers("increase")} />
          </div>
        </div>
        <div className={classes.input_container}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter your username..."
            id="username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
        </div>
        <div className={classes.input_container}>
          <label htmlFor="room_name">Room Name</label>
          <input
            type="text"
            placeholder="Enter a room name..."
            id="room_name"
            value={data.room_name}
            onChange={(e) => setData({ ...data, room_name: e.target.value })}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Let's start the fun <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
