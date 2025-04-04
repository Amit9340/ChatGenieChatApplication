import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";
import translationRoutes from "./routes/translation.js";
import http from "http";
import { Server } from "socket.io";
import disappearingMessages from "./disappearingMessages.js";

//dotEnv config
dotenv.config();

//create express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

disappearingMessages(io);

//morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


//helmet
app.use(helmet());

//parse json request url
app.use(express.json());

//parse json request body
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(mongoSanitize());

//enable cookie parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//file upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//cors
// app.use(
//   cors({
//     origin: "https://whatsapp-clone-frontend-liart.vercel.app",
//     credentials: true,
//   })
// );


// import cors from 'cors';
// app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 
// app.use(cors({ origin: "*", credentials: true }));
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// const corsOptions = {
//   origin: "http://localhost:3000", // Allow frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };

// Use only one CORS middleware
// app.use(cors(corsOptions));

const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions)); // Apply once globally

// ✅ Register translation routes FIRST
app.use("/translate", translationRoutes);

//api v1 routes
app.use("/api/v1", routes);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});

//error handling
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
