"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Plus } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";

interface Vendor {
	id: string;
	name: string;
	avatar: string;
	store: string;
	lastSeen: string;
}

// Mock vendors data - in a real app, this would come from an API
const vendors: Vendor[] = [
	{
		id: "7f02db15-c18b-4365-8895-9dbfd45b7889",
		name: "John's Bookstore",
		avatar: "/images/placeholder.svg",
		store: "Academic Books Hub",
		lastSeen: "2 minutes ago",
	},
	{
		id: "2",
		name: "Tech Haven",
		avatar: "/images/placeholder.svg",
		store: "Electronics & Gadgets",
		lastSeen: "1 hour ago",
	},
	{
		id: "3",
		name: "Campus Essentials",
		avatar: "/images/placeholder.svg",
		store: "Student Supplies",
		lastSeen: "3 hours ago",
	},
];

export default function MessagesPage() {
	const {
		conversations,
		activeConversation,
		messages,
		sendMessage,
		setActiveConversation,
		isLoading,
	} = useChat();
	const [newMessage, setNewMessage] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [availableVendors, _setAvailableVendors] =
		useState<Vendor[]>(vendors);
	const { user } = useAuth();

	const socket = useSocket();
	useEffect(() => {
		// Scroll to bottom of messages when new message is added
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = (e: React.FormEvent, chatId: string) => {
		e.preventDefault();
		if (newMessage.trim()) {
			sendMessage(newMessage.trim(), chatId);
			setNewMessage("");
		}
	};

	const filteredVendors = availableVendors.filter(
		(vendor) =>
			vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			vendor.store.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const startNewConversation = async (vendorId: string) => {
		// const chat = await startChat(vendorId, user.id);
		socket.emit("join", vendorId, (response: any) => {
			if (response.success) {
				setActiveConversation({
					...response.chat,
					messages: response.chat.messages.map((m) => {
						return {
							...m,
							isRead: true,
						};
					}),
				});
				console.log({
					...response.chat,
					messages: response.chat.messages.map((m) => {
						return {
							...m,
							isRead: true,
						};
					}),
				});
			} else {
				throw new Erorr("Something went wrong");
			}
		});
	};

	if (isLoading) {
		return (
			<div className="container mx-auto p-4">
				<div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 h-[80vh]">
					<div className="border rounded-lg p-4 space-y-4">
						<Skeleton className="h-10 w-full" />
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="flex items-center space-x-4">
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-[150px]" />
										<Skeleton className="h-4 w-[100px]" />
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="border rounded-lg p-4">
						<Skeleton className="h-[600px] w-full" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 h-[80vh]">
				{/* Conversations Sidebar */}
				<div className="border rounded-lg flex flex-col">
					<div className="p-4 border-b">
						<div className="flex items-center gap-2 mb-4">
							<div className="relative flex-1">
								<Search
									className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<Input
									type="search"
									placeholder="Search conversations..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" size="icon">
										<Plus className="h-4 w-4" />
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											New Conversation
										</DialogTitle>
										<DialogDescription>
											Select a vendor to start a
											conversation with
										</DialogDescription>
									</DialogHeader>
									<ScrollArea className="h-[300px] pr-4">
										{filteredVendors.map((vendor) => (
											<div
												key={vendor.id}
												className="flex items-center gap-4 p-2 hover:bg-accent rounded-lg cursor-pointer"
												onClick={() =>
													startNewConversation(
														vendor.id
													)
												}>
												<Avatar>
													<AvatarImage
														src={vendor.avatar}
														alt={vendor.name}
													/>
													<AvatarFallback>
														{vendor.name[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">
														{vendor.name}
													</p>
													<p className="text-sm text-muted-foreground">
														{vendor.store}
													</p>
												</div>
											</div>
										))}
									</ScrollArea>
								</DialogContent>
							</Dialog>
						</div>
						<div className="space-y-2">
							{conversations.map((conv) => {
								console.log(conv);

								return (
									<div
										key={conv.id}
										className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-accent ${
											activeConversation &&
											activeConversation.id === conv.id
												? "bg-accent"
												: ""
										}`}
										onClick={() =>
											startNewConversation(
												conv.participants.find(
													(p) => p.id !== user.id
												).id
											)
										}>
										<Avatar>
											<AvatarImage
												src="/images/placeholder.svg"
												alt={
													conv.participants[0]
														.username
												}
											/>
											<AvatarFallback>
												{conv.participants[0].username}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start">
												<p className="font-medium truncate">
													{
														conv.participants[0]
															.username
													}
												</p>
												{conv.messages.filter(
													(m) => !m.isRead
												).length > 0 && (
													<span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
														{
															conv.messages.filter(
																(m) => !m.isRead
															).length
														}
													</span>
												)}
											</div>
											<p className="text-sm text-muted-foreground truncate">
												{conv.messages[0].content}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Chat Area */}
				<div className="border rounded-lg flex flex-col h-full overflow-scroll">
					{activeConversation ? (
						<>
							{/* Chat Header */}
							<div className="p-4 border-b">
								<div className="flex items-center gap-4">
									<Avatar>
										<AvatarImage
											src="/images/placeholder.svg"
											alt={
												conversations.find(
													(conv) =>
														conv.id ===
														activeConversation.id
												)?.participants[0].username ||
												"Conversation"
											}
										/>
										<AvatarFallback>
											{
												conversations.find(
													(conv) =>
														conv.id ===
														activeConversation.id
												)?.participants[0].username
											}
										</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="font-medium">
											{
												conversations.find(
													(conv) =>
														conv.id ===
														activeConversation.id
												)?.participants[0].username
											}
										</h2>
										<p className="text-sm text-muted-foreground">
											Online
										</p>
									</div>
								</div>
							</div>

							{/* Messages */}
							<ScrollArea className="flex-1 p-4 ">
								<div className="space-y-4">
									{activeConversation.messages.map(
										(message) => (
											<div
												key={message.id}
												className={`flex ${
													message.senderId === user.id
														? "justify-end"
														: "justify-start"
												}`}>
												<div
													className={`max-w-[70%] rounded-lg p-3 ${
														message.senderId ===
														user.id
															? "bg-primary text-primary-foreground"
															: "bg-muted text-muted-foreground"
													}`}>
													<p>{message.content}</p>
													<p className="text-xs mt-1 opacity-70">
														{new Date(
															message.createdAt
														).toLocaleTimeString(
															[],
															{
																hour: "2-digit",
																minute: "2-digit",
															}
														)}
													</p>
												</div>
											</div>
										)
									)}
									<div ref={messagesEndRef} />
								</div>
							</ScrollArea>

							{/* Message Input */}
							<div className="p-4 border-t">
								<form
									onSubmit={(e) =>
										handleSendMessage(
											e,
											activeConversation.id
										)
									}
									className="flex gap-2">
									<Input
										type="text"
										placeholder="Type a message..."
										value={newMessage}
										onChange={(e) =>
											setNewMessage(e.target.value)
										}
										className="flex-1"
									/>
									<Button type="submit">
										<Send className="h-4 w-4" />
									</Button>
								</form>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center">
							<div className="text-center">
								<h3 className="text-lg font-medium">
									No Conversation Selected
								</h3>
								<p className="text-muted-foreground">
									Choose a conversation from the sidebar or
									start a new one
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
