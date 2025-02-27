"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";

export function Chat() {
	const [isOpen, setIsOpen] = useState(false);
	const {
		conversations,
		activeConversation,
		messages,
		sendMessage,
		setActiveConversation,
	} = useChat();
	const [newMessage, setNewMessage] = useState("");

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (newMessage.trim()) {
			sendMessage(newMessage.trim());
			setNewMessage("");
		}
	};

	const totalUnreadCount = conversations.reduce(
		(sum, conv) => sum + conv.unreadCount,
		0
	);

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen ? (
				<Card className="w-80">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Chats
						</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(false)}>
							<X className="h-4 w-4" />
						</Button>
					</CardHeader>
					<CardContent>
						{activeConversation === null ? (
							<ScrollArea className="h-[300px] w-full pr-4">
								{conversations.map((conv) => (
									<Button
										key={conv.id}
										variant="ghost"
										className="w-full justify-start"
										onClick={() =>
											setActiveConversation(conv.id)
										}>
										<div className="flex items-center justify-between w-full">
											<span>{conv.participantName}</span>
											{conv.unreadCount > 0 && (
												<span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
													{conv.unreadCount}
												</span>
											)}
										</div>
									</Button>
								))}
							</ScrollArea>
						) : (
							<>
								<Button
									variant="ghost"
									onClick={() => setActiveConversation(null)}
									className="mb-2">
									&larr; Back to contacts
								</Button>
								<ScrollArea className="h-[200px] w-full pr-4">
									{messages.map((message) => (
										<div
											key={message.id}
											className={`mb-4 ${
												message.senderId === "1"
													? "text-right"
													: ""
											}`}>
											<p className="text-sm font-semibold">
												{message.senderId === "1"
													? "You"
													: "Seller"}
											</p>
											<p className="text-sm">
												{message.content}
											</p>
										</div>
									))}
								</ScrollArea>
							</>
						)}
					</CardContent>
					{activeConversation !== null && (
						<CardFooter>
							<form
								onSubmit={handleSendMessage}
								className="flex w-full space-x-2">
								<Input
									type="text"
									placeholder="Type a message..."
									value={newMessage}
									onChange={(e) =>
										setNewMessage(e.target.value)
									}
									className="flex-grow"
								/>
								<Button type="submit">Send</Button>
							</form>
						</CardFooter>
					)}
				</Card>
			) : (
				<Button onClick={() => setIsOpen(true)}>
					<MessageCircle className="mr-2 h-4 w-4" /> Chat
					{totalUnreadCount > 0 && (
						<span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
							{totalUnreadCount}
						</span>
					)}
				</Button>
			)}
		</div>
	);
}
