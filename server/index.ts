import CONFIG from "./utils/config";
import Routes from "./routes";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import useSocket from "./middlewears/socket";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

useSocket(io);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
Routes(app);

httpServer.listen(CONFIG.env.PORT, () => {
	console.log(`Listening on ${CONFIG.env.PORT}`);
});
