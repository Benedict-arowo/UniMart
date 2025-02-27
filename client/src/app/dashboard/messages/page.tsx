"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface Message {
	id: number;
	sender: string;
	content: string;
	timestamp: string;
}

interface Conversation {
	id: number;
	user: string;
	messages: Message[];
}

const initialConversations: Conversation[] = [
	{
		id: 1,
		user: "John Doe",
		messages: [
			{
				id: 1,
				sender: "John Doe",
				content: "Hi, is this product still available?",
				timestamp: "2023-06-15 10:30",
			},
			{
				id: 2,
				sender: "Seller",
				content: "Yes, it is! Do you have any questions about it?",
				timestamp: "2023-06-15 10:35",
			},
		],
	},
	{
		id: 2,
		user: "Jane Smith",
		messages: [
			{
				id: 3,
				sender: "Jane Smith",
				content: `Hello, I'm interested in your product. Can you provide more details?`,
				timestamp: "2023-06-15 11:00",
			},
		],
	},
];

const quickResponses = [
	{
		id: 1,
		title: "Product Availability",
		content:
			"Yes, the product is currently available. Would you like to place an order?",
	},
	{
		id: 2,
		title: "Shipping Information",
		content:
			"We offer free shipping on orders over $50. Delivery usually takes 3-5 business days.",
	},
	{
		id: 3,
		title: `Return Policy, content: 'We have a 30-day return policy. If you're not satisfied, you can return the item for a full refund.`,
	},
	{
		id: 4,
		title: `Custom Order, content: 'We do accept custom orders. Please provide more details about what you're looking for.`,
	},
];

export default function MessagesPage() {
	const [conversations, setConversations] =
		useState<Conversation[]>(initialConversations);
	const [newMessage, setNewMessage] = useState("");
	const [activeConversation, setActiveConversation] = useState<number>(
		conversations[0].id
	);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (newMessage.trim()) {
			const message: Message = {
				id:
					Math.max(
						...conversations.flatMap((c) =>
							c.messages.map((m) => m.id)
						)
					) + 1,
				sender: "Seller",
				content: newMessage.trim(),
				timestamp: new Date().toLocaleString(),
			};
			setConversations((prevConversations) =>
				prevConversations.map((conv) =>
					conv.id === activeConversation
						? { ...conv, messages: [...conv.messages, message] }
						: conv
				)
			);
			setNewMessage("");
		}
	};

	const handleQuickResponse = (content: string) => {
		setNewMessage(content);
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Messages</h1>
			<Card>
				<CardHeader>
					<CardTitle>Conversations</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs
						value={activeConversation.toString()}
						onValueChange={(value) =>
							setActiveConversation(Number(value))
						}>
						<TabsList className="grid w-full grid-cols-2">
							{conversations.map((conv) => (
								<TabsTrigger
									key={conv.id}
									value={conv.id.toString()}>
									{conv.user}
								</TabsTrigger>
							))}
						</TabsList>
						{conversations.map((conv) => (
							<TabsContent
								key={conv.id}
								value={conv.id.toString()}>
								<Card>
									<CardHeader>
										<CardTitle>
											Chat with {conv.user}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ScrollArea className="h-[400px] mb-4">
											{conv.messages.map((message) => (
												<div
													key={message.id}
													className={`mb-4 ${
														message.sender ===
														"Seller"
															? "text-right"
															: ""
													}`}>
													<div
														className={`inline-block p-2 rounded-lg ${
															message.sender ===
															"Seller"
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
										<form
											onSubmit={handleSendMessage}
											className="flex gap-2">
											<Input
												value={newMessage}
												onChange={(e) =>
													setNewMessage(
														e.target.value
													)
												}
												placeholder="Type your message..."
											/>
											<Popover>
												<PopoverTrigger asChild>
													<Button variant="outline">
														Quick Responses
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-80">
													<div className="grid gap-4">
														<h4 className="font-medium leading-none">
															Quick Responses
														</h4>
														{quickResponses.map(
															(response) => (
																<Button
																	key={
																		response.id
																	}
																	variant="ghost"
																	className="justify-start"
																	onClick={() =>
																		handleQuickResponse(
																			response.content!
																		)
																	}>
																	{
																		response.title
																	}
																</Button>
															)
														)}
													</div>
												</PopoverContent>
											</Popover>
											<Button type="submit">Send</Button>
										</form>
									</CardContent>
								</Card>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
