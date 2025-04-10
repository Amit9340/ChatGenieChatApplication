import mongoose from "mongoose";
import app from "./app.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";
import dotenv from "dotenv";  
dotenv.config({ path: ".env.example" });
import http from "http";
import { Server } from "socket.io";
import { scheduleMessagesCron } from "./scheduledMessages.js";
import disappearingMessages from "./disappearingMessages.js";



// disappearingMessages(io);
// console.log("📦 Disappearing Messages Module Loaded");

// require('dotenv').config();
//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 8000;
console.log("Port: " + PORT)

// exit on mognodb error
mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error : ${err}`);
  process.exit(1);
  console.log("Port: " + PORT)
});

//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

//mongodb connection
mongoose.connect(DATABASE_URL).then(() => {
  logger.info("Connected to Mongodb.");
});

// let server;
// Create HTTP server (✔ Fix: Define server properly)
let server = http.createServer(app);
server = app.listen(PORT, () => {
  logger.info(`Server is listening at ${PORT}.`);
  console.log("Port: " + PORT)
});


//socket io
const io = new Server(server, {
  // pingTimeout: 60000,
  // cors: {
  //   origin: process.env.CLIENT_ENDPOINT,
  // },
  cors: {
    // origin: process.env.CLIENT_ENDPOINT || "http://localhost:3000", // Allow frontend origin
    origin: "*", // Change to specific frontend URL for security
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"], // Ensure proper transport
  },
});
app.set("io", io);
scheduleMessagesCron(io);
console.log("📦 Scheduled Messages Module Loaded");

disappearingMessages(io);
console.log("📦 Disappearing Messages Module Loaded");

io.on("connection", (socket) => {
  logger.info("socket io connected successfully.");
  SocketServer(socket, io);
});

//handle server errors
const exitHandler = () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("Server closed.");
    process.exit(1);
  }
});

