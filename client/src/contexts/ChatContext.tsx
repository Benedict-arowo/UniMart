"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface Message {
	id: number;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
}

interface Conversation {
	id: string;
	participantId: string;
	participantName: string;
	lastMessage: string;
	unreadCount: number;
}

interface ChatContextType {
	conversations: Conversation[];
	activeConversation: string | null;
	messages: Message[];
	sendMessage: (content: string) => void;
	setActiveConversation: (conversationId: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [activeConversation, setActiveConversation] = useState<string | null>(
		null
	);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		// Fetch conversations from API
		// This is a mock implementation
		setConversations([
			{
				id: "1",
				participantId: "2",
				participantName: "John Doe",
				lastMessage: "Hello!",
				unreadCount: 1,
			},
			{
				id: "2",
				participantId: "3",
				participantName: "Jane Smith",
				lastMessage: "Are you there?",
				unreadCount: 2,
			},
		]);
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

	const sendMessage = (content: string) => {
		if (activeConversation) {
			const newMessage: Message = {
				id: messages.length + 1,
				senderId: "1", // Assuming current user id is '1'
				receiverId: activeConversation,
				content,
				timestamp: new Date(),
			};
			setMessages([...messages, newMessage]);
			// In a real app, you'd send this message to your backend here
		}
	};

	return (
		<ChatContext.Provider
			value={{
				conversations,
				activeConversation,
				messages,
				sendMessage,
				setActiveConversation,
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
