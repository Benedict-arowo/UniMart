"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Send } from "lucide-react";

interface Message {
	id: number;
	sender: string;
	content: string;
	timestamp: string;
}

interface Chat {
	id: number;
	participants: string[];
	messages: Message[];
	lastMessage: string;
	lastMessageTime: string;
}

const initialChats: Chat[] = [
	{
		id: 1,
		participants: ["Admin", "John Doe"],
		messages: [
			{
				id: 1,
				sender: "John Doe",
				content: "Hello, I have a question about my order.",
				timestamp: "2023-06-15 10:30",
			},
			{
				id: 2,
				sender: "Admin",
				content: `Hi John, I'd be happy to help. What's your order number?`,
				timestamp: "2023-06-15 10:35",
			},
		],
		lastMessage: `Hi John, I'd be happy to help. What's your order number?`,
		lastMessageTime: "2023-06-15 10:35",
	},
	{
		id: 2,
		participants: ["Admin", "Jane Smith"],
		messages: [
			{
				id: 3,
				sender: "Jane Smith",
				content: "I need to change my shipping address.",
				timestamp: "2023-06-15 11:00",
			},
			{
				id: 4,
				sender: "Admin",
				content:
					"Sure, I can help you with that. Can you provide your order number?",
				timestamp: "2023-06-15 11:05",
			},
		],
		lastMessage:
			"Sure, I can help you with that. Can you provide your order number?",
		lastMessageTime: "2023-06-15 11:05",
	},
];

export default function MessagesPage() {
	const [chats, setChats] = useState<Chat[]>(initialChats);
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [newMessage, setNewMessage] = useState("");

	const handleChatSelect = (chat: Chat) => {
		setSelectedChat(chat);
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedChat && newMessage.trim()) {
			const updatedChat = {
				...selectedChat,
				messages: [
					...selectedChat.messages,
					{
						id:
							Math.max(
								...selectedChat.messages.map((m) => m.id)
							) + 1,
						sender: "Admin",
						content: newMessage.trim(),
						timestamp: new Date().toLocaleString(),
					},
				],
				lastMessage: newMessage.trim(),
				lastMessageTime: new Date().toLocaleString(),
			};
			setChats(
				chats.map((chat) =>
					chat.id === selectedChat.id ? updatedChat : chat
				)
			);
			setSelectedChat(updatedChat);
			setNewMessage("");
		}
	};

	return (
		<div className="flex h-[calc(100vh-2rem)] gap-4">
			<div className="w-1/3 bg-white rounded-lg shadow">
				<div className="p-4 border-b">
					<h2 className="text-xl font-semibold">Chats</h2>
				</div>
				<ScrollArea className="h-[calc(100vh-10rem)]">
					{chats.map((chat) => (
						<div
							key={chat.id}
							className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
								selectedChat?.id === chat.id
									? "bg-gray-100"
									: ""
							}`}
							onClick={() => handleChatSelect(chat)}>
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-semibold">
										{chat.participants
											.filter((p) => p !== "Admin")
											.join(", ")}
									</h3>
									<p className="text-sm text-gray-500">
										{chat.lastMessage}
									</p>
								</div>
								<span className="text-xs text-gray-400">
									{chat.lastMessageTime}
								</span>
							</div>
						</div>
					))}
				</ScrollArea>
			</div>
			<div className="flex-1 bg-white rounded-lg shadow">
				{selectedChat ? (
					<>
						<div className="p-4 border-b flex justify-between items-center">
							<h2 className="text-xl font-semibold">
								{selectedChat.participants
									.filter((p) => p !== "Admin")
									.join(", ")}
							</h2>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="h-8 w-8 p-0">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>
										Actions
									</DropdownMenuLabel>
									<DropdownMenuItem>
										Mark as resolved
									</DropdownMenuItem>
									<DropdownMenuItem>
										Assign to team member
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="text-red-600">
										Block user
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<ScrollArea className="h-[calc(100vh-16rem)] p-4">
							{selectedChat.messages.map((message) => (
								<div
									key={message.id}
									className={`mb-4 ${
										message.sender === "Admin"
											? "text-right"
											: ""
									}`}>
									<div
										className={`inline-block p-2 rounded-lg ${
											message.sender === "Admin"
												? "bg-blue-500 text-white"
												: "bg-gray-200"
										}`}>
										<p className="font-semibold">
											{message.sender}
										</p>
										<p>{message.content}</p>
										<p className="text-xs mt-1">
											{message.timestamp}
										</p>
									</div>
								</div>
							))}
						</ScrollArea>
						<div className="p-4 border-t">
							<form
								onSubmit={handleSendMessage}
								className="flex gap-2">
								<Input
									value={newMessage}
									onChange={(e) =>
										setNewMessage(e.target.value)
									}
									placeholder="Type your message..."
									className="flex-1"
								/>
								<Button type="submit">
									<Send className="h-4 w-4 mr-2" />
									Send
								</Button>
							</form>
						</div>
					</>
				) : (
					<div className="h-full flex items-center justify-center">
						<p className="text-gray-500">
							Select a chat to view messages
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
