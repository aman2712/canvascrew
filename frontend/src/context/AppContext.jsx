import { createContext, useState } from "react";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState("");

  const value = {
    username,
    setUsername,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
