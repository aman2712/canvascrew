import classes from "../styles/home.module.css";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpg";
import { useEffect, useState } from "react";

const Home = () => {
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/public-rooms");
      const resp = await response.json();
      console.log(resp);
      setRooms(resp);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className={classes.home_title}>Welcome to CanvasCrew</h1>
      <p className={classes.home_desc}>
        CanvasCrew is a collaborative drawing app that lets you unleash your
        creativity with friends in real time. Join private rooms to sketch,
        doodle, and create masterpieces together, no matter where you are.
      </p>
      <div className={classes.homeDisplay}>
        <div className={classes.home_rooms}>
          <div className={classes.rooms_header}>
            <h3>Join a public room</h3>
            <Link to="/create-room">
              <button className="btn btn-primary">Create a Room</button>
            </Link>
          </div>
          {rooms.length === 0 ? (
            <p>No rooms created yet. How about you make one :)</p>
          ) : (
            rooms.map((room) => (
              <div
                className={classes.room}
                key={room.id}
                onClick={() => navigate(`/game/${room.id}`)}
              >
                <div>
                  <h3>{room.room_name}</h3>
                  <p>by {room.creator_name}</p>
                </div>
                <p>
                  {room?.players.length}/{room?.max_players}
                </p>
              </div>
            ))
          )}
        </div>
        <img src={bg} alt="display" />
      </div>
    </div>
  );
};

export default Home;
