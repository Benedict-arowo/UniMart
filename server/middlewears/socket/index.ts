import { DefaultEventsMap, Server } from "socket.io";
import { authenticateSockets } from "../authenticated";
import ChatService from "../../services/chat.service";
import { Sock } from "../../utils/types";
import prisma from "../../prisma";

const useSocket = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
	const chatService = new ChatService();

	io.use(authenticateSockets);
	io.on("connection", async (socket: Sock) => {
		console.log("a user connected");
		await prisma.user.update({
			where: { id: socket.user.id },
			data: {
				isOnline: true,
			},
		});
		console.log(socket.user);

		socket.on("join", async (participantId, callback) => {
			const chat = await chatService.startChat(
				socket.user["id"],
				participantId
			);

			console.log(chat.id);
			socket.join(chat.id);
			callback({ success: true, chat: chat });
		});

		socket.on("message", async (message, chatId, callback) => {
			const newMessage = await chatService.sendMessage(
				chatId,
				socket.user["id"],
				message
			);

			socket.to(chatId).emit("message", newMessage);
			callback({ success: true, message: newMessage });
		});

		socket.on("disconnect", async () => {
			await prisma.user.update({
				where: { id: socket.user.id },
				data: {
					isOnline: false,
				},
			});
			console.log("user disconnected");
		});
	});
};

export default useSocket;
