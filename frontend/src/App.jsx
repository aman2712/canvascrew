import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home";
import CreateRoom from "./screens/create-room";
import DrawingRoom from "./screens/drawing-room";
import { AppProvider } from "./context/AppContext";
import GameOnboarding from "./screens/game-onboarding";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/onboarding/:roomId" element={<GameOnboarding />} />
          <Route path="/game/:roomId" element={<DrawingRoom />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
