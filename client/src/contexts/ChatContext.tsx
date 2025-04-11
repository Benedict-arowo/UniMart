"use client";

import { getChats } from "@/services/chat";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";

interface Message {
	id: number;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
}

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
	messages: Message[];
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
	const [messages, setMessages] = useState<Message[]>([]);
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
		if (activeConversation) {
			// Fetch messages for active conversation
			// This is a mock implementation
			setMessages([
				{
					id: 1,
					senderId: "1",
					receiverId: "2",
					content: "Hi there!",
					timestamp: new Date(),
				},
				{
					id: 2,
					senderId: "2",
					receiverId: "1",
					content: "Hello!",
					timestamp: new Date(),
				},
			]);
		}
	}, [activeConversation]);

	const sendMessage = (content: string, chatId: string) => {
		// const newMessage: Message = {
		// 	id: messages.length + 1,
		// 	senderId: "1", // Assuming current user id is '1'
		// 	receiverId: activeConversation,
		// 	content,
		// 	timestamp: new Date(),
		// };
		// setMessages([...messages, newMessage]);
		// In a real app, you'd send this message to your backend here
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
				activeConversation,
				messages,
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
