"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotification } from "../../contexts/NotificationContext";

export function Notification() {
	const { notifications, markAsRead, clearNotification } = useNotification();

	const unreadCount = notifications.filter((n) => !n.read).length;

	const formatTimestamp = (date: Date) => {
		const now = new Date();
		const diffInSeconds = Math.floor(
			(now.getTime() - date.getTime()) / 1000
		);
		if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)}h ago`;
		return `${Math.floor(diffInSeconds / 86400)}d ago`;
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-[1.2rem] w-[1.2rem]" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center">
							{unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<Tabs defaultValue="all">
					<div className="flex justify-between items-center mb-2">
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="unread">Unread</TabsTrigger>
						</TabsList>
						<Button
							variant="ghost"
							size="sm"
							onClick={() =>
								notifications.forEach((n) => markAsRead(n.id))
							}>
							<Check className="mr-2 h-4 w-4" />
							Mark all read
						</Button>
					</div>
					<TabsContent value="all">
						<NotificationList
							notifications={notifications}
							markAsRead={markAsRead}
							clearNotification={clearNotification}
							formatTimestamp={formatTimestamp}
						/>
					</TabsContent>
					<TabsContent value="unread">
						<NotificationList
							notifications={notifications.filter((n) => !n.read)}
							markAsRead={markAsRead}
							clearNotification={clearNotification}
							formatTimestamp={formatTimestamp}
						/>
					</TabsContent>
				</Tabs>
			</PopoverContent>
		</Popover>
	);
}

function NotificationList({
	notifications,
	markAsRead,
	clearNotification,
	formatTimestamp,
}) {
	return (
		<ScrollArea className="h-[300px]">
			{notifications.length === 0 ? (
				<p className="text-center text-gray-500 py-4">
					No notifications
				</p>
			) : (
				notifications.map((notification) => (
					<div
						key={notification.id}
						className={`p-2 mb-2 rounded flex items-start justify-between ${
							notification.read ? "bg-gray-100" : "bg-blue-50"
						}`}>
						<div
							className="flex-1"
							onClick={() => markAsRead(notification.id)}>
							<p className="text-sm font-medium">
								{notification.message}
							</p>
							<p className="text-xs text-gray-500">
								{formatTimestamp(notification.timestamp)}
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => clearNotification(notification.id)}>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))
			)}
		</ScrollArea>
	);
}
