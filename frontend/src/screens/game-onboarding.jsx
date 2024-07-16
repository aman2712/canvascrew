import { useContext, useState } from "react";
import classes from "../styles/game-onboarding.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaArrowRightLong } from "react-icons/fa6";

const GameOnboarding = () => {
  const { setUsername } = useContext(AppContext);
  const { roomId } = useParams();
  const [usernameInput, setUsernameInput] = useState("");

  const navigate = useNavigate();

  function handleSubmit() {
    if (usernameInput === "") return;
    setUsername(usernameInput);
    navigate(`/game/${roomId}`);
  }

  return (
    <div className={classes.onboarding}>
      <div className={classes.form}>
        <div className={classes.input_container}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter your username..."
            id="username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Join Game <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
};

export default GameOnboarding;
