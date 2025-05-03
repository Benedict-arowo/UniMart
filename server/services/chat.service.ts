import { ForbiddenError, NotFoundError } from "../middlewears/error";
import prisma from "../prisma";
import CONFIG from "../utils/config";

class ChatService {
	getChats = async (userId: string, limit = 10, page = 1) => {
		const chats = await prisma.chat.findMany({
			where: {
				participants: {
					some: {
						id: userId,
					},
				},
				isArchived: false,
			},
			include: {
				participants: {
					select: {
						id: true,
						username: true,
					},
				},
				messages: {
					select: {
						id: true,
						content: true,
						senderId: true,
						createdAt: true,
						isRead: true,
					},
					orderBy: {
						createdAt: "desc",
					},
					take: 50, // latest message only
				},
			},
			orderBy: {
				updatedAt: "desc",
			},
			skip: limit * (page - 1),
			take: limit,
		});

		return chats;
	};

	startChat = async (buyerId: string, sellerId: string) => {
		if (buyerId === sellerId) {
			throw new ForbiddenError("You cannot chat with yourself.");
		}

		const existingChat = await prisma.chat.findFirst({
			where: {
				participants: {
					every: {
						id: {
							in: [buyerId, sellerId],
						},
					},
				},
			},
			include: {
				participants: true,

				messages: {
					take: 50,
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (existingChat) {
			await prisma.message.updateMany({
				where: {
					chatId: existingChat.id,
					isRead: false,
				},
				data: {
					isRead: true,
				},
				limit: 50,
			});

			return existingChat;
		}

		const newChat = await prisma.chat.create({
			data: {
				participants: {
					connect: [{ id: buyerId }, { id: sellerId }],
				},
			},
			include: {
				participants: {
					select: {
						id: true,
						username: true,
						isOnline: true,
						isVerified: true,
					},
				},
				messages: {
					take: 50,
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		return newChat;
	};

	getMessages = async (
		chatId: string,
		userId: string,
		limit: number = 50,
		cursor?: string
	) => {
		const isParticipant = await prisma.chat.findFirst({
			where: {
				id: chatId,
				participants: {
					some: { id: userId },
				},
			},
			select: { id: true },
		});

		if (!isParticipant) {
			throw new ForbiddenError("You are not a participant in this chat.");
		}

		const messages = await prisma.message.findMany({
			where: { chatId },
			select: {
				id: true,
				content: true,
				senderId: true,
				isRead: true,
				createdAt: true,
				sender: {
					select: {
						id: true,
						username: true,
						email: true,
						isOnline: true,
						store: {
							select: {
								id: true,
								name: true,
								customUrl: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			take: limit + 1,
			skip: cursor ? 1 : 0, // skip the cursor itself if provided
			cursor: cursor ? { id: cursor } : undefined,
		});

		await prisma.message.updateMany({
			where: {
				chatId,
				isRead: false,
				senderId: { not: userId },
			},
			data: { isRead: true },
		});

		// 4. Determine if there are more messages
		const hasMore = messages.length > limit;
		if (hasMore) messages.pop();

		return {
			messages: messages.reverse(),
			hasMore,
		};
	};

	sendMessage = async (chatId: string, userId: string, message: string) => {
		const chat = await prisma.chat.findUnique({
			where: {
				id: chatId,
			},
			select: {
				participants: {
					select: {
						id: true,
					},
				},
			},
		});

		if (!chat) throw new NotFoundError("Chat not found.");

		console.log(chat);

		if (!chat.participants.some((participant) => participant.id === userId))
			throw new ForbiddenError(
				"You are not allowed to send messages to this chat."
			);

		const created_message = await prisma.message.create({
			data: {
				content: message,
				chatId,
				senderId: userId,
				type: "TEXT",
			},
		});

		return created_message;
	};

	deleteMessage = async (messageId: string, userId: string) => {
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: { senderId: true, isDeleted: true },
		});

		if (!message) throw new NotFoundError("Message not found.");
		if (message.isDeleted)
			throw new NotFoundError("This message has already been deleted.");
		if (message.senderId !== userId) {
			throw new ForbiddenError("You can only delete your own messages.");
		}

		await prisma.message.update({
			where: { id: messageId },
			data: { isDeleted: true, deletedAt: new Date() },
		});

		return true;
	};

	markMessageAsSeen = async (chatId: string, userId: string) => {
		await prisma.message.updateMany({
			where: {
				chatId,
				isRead: false,
				senderId: { not: userId },
			},
			data: { isRead: true },
		});

		return true;
	};

	editMessage = async (
		messageId: string,
		userId: string,
		newContent: string
	) => {
		// Find the message to ensure it exists and belongs to the user
		const message = await prisma.message.findUnique({
			where: { id: messageId },
			select: {
				senderId: true,
				createdAt: true,
				isDeleted: true,
				isEdited: true,
			},
		});

		if (!message) throw new NotFoundError("Message not found.");
		if (message.isDeleted)
			throw new NotFoundError("This message has been deleted.");
		if (message.senderId !== userId) {
			throw new ForbiddenError("You can only edit your own messages.");
		}

		// Check if the message can still be edited based on time limit
		const timeDifference =
			new Date().getTime() - message.createdAt.getTime();
		const timeLimitInMilliseconds =
			CONFIG.env.MESSAGE_EDIT_LIMIT * 60 * 1000;

		if (timeDifference > timeLimitInMilliseconds) {
			throw new ForbiddenError(
				"You can only edit your message within the time limit."
			);
		}

		await prisma.message.update({
			where: { id: messageId },
			data: {
				content: newContent,
				isEdited: true,
				editedAt: new Date(),
			},
		});

		return true;
	};
}

export default ChatService;
