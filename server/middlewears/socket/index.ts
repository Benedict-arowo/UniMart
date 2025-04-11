import { DefaultEventsMap, Server } from "socket.io";
import { authenticateSockets } from "../authenticated";
import ChatService from "../../services/chat.service";
import { Sock } from "../../utils/types";

const useSocket = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	const chatService = new ChatService();

	io.use(authenticateSockets);
	io.on("connection", (socket: Sock) => {
		console.log("a user connected");

		socket.on("join", async (participantId, callback) => {
			console.log(participantId, socket.user);
			const chat = await chatService.startChat(
				socket.user["id"],
				participantId
			);

			console.log(chat);
			socket.join(chat.id); // Join the room with chatId
			callback({ success: true, chat: chat });
		});

		socket.on("message", async (message, chatId, callback) => {
			const newMessage = await chatService.sendMessage(
				chatId,
				socket.user["id"],
				message
			);

			socket.to(message.chatId).emit("message", newMessage);
			callback({ success: true, message: newMessage });
		});

		socket.on("disconnect", () => {
			console.log("user disconnected");
		});

		socket.on("message", (msg) => {
			console.log("message: " + msg);
			io.emit("message", msg); // Broadcast the message to all connected clients
		});
	});
};

export default useSocket;
