"use client";

import { getChats } from "@/services/chat";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";

interface Conversation {
	id: "55ccf82e-fc2f-47bd-9705-cbcff533b1e7";
	isArchived: false;
	createdAt: "2025-04-11T06:44:35.407Z";
	updatedAt: "2025-04-11T06:44:35.407Z";
	participants: [
		{
			id: "7f02db15-c18b-4365-8895-9dbfd45b7889";
			username: "ibrahimyohanna29_u";
			email: "ibrahimyohanna29@gmail.com";
			lastOnline: null;
			roles: ["BUYER", "SELLER"];
			isOnline: false;
			isVerified: true;
			createdAt: Date;
		}
	];
	messages: {
		id: string;
		content: string;
		type: "TEXT";
		isRead: boolean;
		isDeleted: boolean;
		deletedAt: null | Date;
		isEdited: boolean;
		editedAt: null | Date;
		createdAt: Date;
		senderId: string;
		chatId: string;
	}[];
}

interface ChatContextType {
	conversations: Conversation[];
	activeConversation: Conversation | null;
	setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
	sendMessage: (content: string, chatId: string) => void;
	setActiveConversation: React.Dispatch<React.SetStateAction<Conversation>>;
	isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [activeConversation, setActiveConversation] =
		useState<Conversation | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	// const [messages, setMessages] = useState<Message[]>([]);
	const socket = useSocket();

	useEffect(() => {
		(async () => {
			const {
				data: { chats },
			} = await getChats();
			setConversations(chats);
			setIsLoading(false);
		})();
	}, []);

	useEffect(() => {
		console.log(activeConversation);
	}, [activeConversation]);

	// useEffect(() => {
	// 	if (!socket) return;
	// 	socket.on("message", (data) => {
	// 		if (data.chatId) {
	// 			// setConversations((prev) => {
	// 			// 	return prev.filter((chat) => {
	// 			// 		if (chat.id === data.chatId) {
	// 			// 			return {
	// 			// 				...chat,
	// 			// 				messages: {
	// 			// 					...chat.messages,
	// 			// 					data,
	// 			// 				},
	// 			// 			};
	// 			// 		}
	// 			// 		return chat;
	// 			// 	});
	// 			// });
	// 			setConversations((prev) =>
	// 				prev.map((chat) =>
	// 					chat.id === data.chatId
	// 						? { ...chat, messages: [...chat.messages, data] }
	// 						: chat
	// 				)
	// 			);

	// 			if (activeConversation?.id === data.chatId) {
	// 				setActiveConversation((prev) =>
	// 					prev
	// 						? { ...prev, messages: [...prev.messages, data] }
	// 						: null
	// 				);
	// 			}
	// 			// if (
	// 			// 	activeConversation &&
	// 			// 	data.chatId === activeConversation.id
	// 			// ) {
	// 			// 	setActiveConversation((prev) => {
	// 			// 		return {
	// 			// 			...prev,
	// 			// 			messages: {
	// 			// 				...prev.messages,
	// 			// 				data,
	// 			// 			},
	// 			// 		};
	// 			// 	});
	// 			// }
	// 		}
	// 		console.log(activeConversation, data);
	// 	});
	// }, [socket]);

	useEffect(() => {
		if (!socket) return;
		const messageHandler = (data) => {
			if (data.chatId) {
				setConversations((prev) =>
					prev.map((chat) =>
						chat.id === data.chatId
							? {
									...chat,
									messages: [
										...chat.messages,
										data.chatId === activeConversation.id
											? { ...data, isRead: true }
											: data,
									],
							  }
							: chat
					)
				);

				if (activeConversation?.id === data.chatId) {
					setActiveConversation((prev) =>
						prev
							? { ...prev, messages: [...prev.messages, data] }
							: null
					);
				}
				console.log(activeConversation, data);
			}
		};

		socket.on("message", messageHandler);
		// Cleanup when component unmounts or dependencies change:
		return () => socket.off("message", messageHandler);
	}, [socket, activeConversation]); // Now the callback is re-registered whenever activeConversation updates

	const sendMessage = (content: string, chatId: string) => {
		if (!content || !chatId) return;
		socket.emit("message", content, chatId, (response: any) => {
			console.log(response);
			if (response.success) {
				setConversations((prev) => {
					return prev.filter((conv) => {
						if (conv.id === chatId) {
							return {
								...conv,
								messages: [...conv.messages, response.message],
							};
						} else return conv;
					});
				});

				if (activeConversation.id === chatId) {
					setActiveConversation((prev) => {
						return {
							...prev,
							messages: [...prev.messages, response.message],
						};
					});
				}
				console.log("Message sent successfully");
			} else {
				console.error("Failed to send message");
			}
		});
	};

	return (
		<ChatContext.Provider
			value={{
				conversations,
				setConversations,
				activeConversation,
				sendMessage,
				setActiveConversation,
				isLoading,
			}}>
			{children}
		</ChatContext.Provider>
	);
}

export function useChat() {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
}
