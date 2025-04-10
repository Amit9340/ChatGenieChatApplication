import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import SocketContext from "./context/SocketContext";
//Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import process from "process";
window.process = process;

// import dotenv from "dotenv";
// dotenv.config({ path: ".env.example" });

//socket io
const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000/api/v1"; // https://default-api.com/api/v1
console.log("API Endpoint:", API_ENDPOINT); // Debugging
const socket = io(API_ENDPOINT.split("/api/v1")[0], {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    withCredentials: true, // Ensure credentials are sent
    transports: ["websocket", "polling"], // Allow WebSocket & polling
    withCredentials: true, // Allow credentials
    transports: ["websocket", "polling"], // Ensure proper transport
  },
});
// const socket = io(process.env.REACT_APP_API_ENDPOINT.split("/api/v1")[0]);

function App() {
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.user);
  // const { token } = user;

  const userState = useSelector((state) => state.user) || {};
  const user = userState.user || {};
  const token = user.token || null;

  return (
    <div className="dark">
      <SocketContext.Provider value={socket}>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route
              exact
              path="/"
              element={
                token ? <Home socket={socket} /> : <Navigate to="/login" />
              }
            />
            <Route
              exact
              path="/login"
              element={!token ? <Login /> : <Navigate to="/" />}
            />
            <Route
              exact
              path="/register"
              element={!token ? <Register /> : <Navigate to="/" />}
            />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
