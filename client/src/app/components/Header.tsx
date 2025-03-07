"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "./Notification";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
	const { user, logout } = useAuth();
	const router = useRouter();

	const Navigate = (path: string) => {
		router.push(path);
	};

	return (
		<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<Link href="/" className="text-2xl font-bold text-primary">
						UniMarket
					</Link>
					<div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-4">
						<form className="flex-1 relative">
							<Input
								type="search"
								placeholder="Search products..."
								className="pl-10 pr-4 py-2 w-full"
							/>
							<Search
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
						</form>
					</div>
					<nav className="hidden md:flex items-center space-x-4">
						{user && (
							<Link
								href="/wishlist"
								className="text-gray-600 hover:text-primary">
								<Heart size={24} />
							</Link>
						)}
						{user && (
							<Link
								href="/messages"
								className="text-gray-600 hover:text-primary">
								<MessageCircle size={24} />
							</Link>
						)}
						{user && <Notification />}
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-8 w-8 rounded-full">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src="/images/placeholder.svg"
												alt={user.username}
											/>
											<AvatarFallback>
												{user.username.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-56"
									align="end"
									forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user.username}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => Navigate("/profile")}>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => Navigate("/wishlist")}>
										<Heart className="mr-2 h-4 w-4" />
										<span>Wishlist</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => Navigate("/messages")}>
										<MessageCircle className="mr-2 h-4 w-4" />
										<span>Messages</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={logout}
										className="cursor-pointer">
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button asChild>
								<Link href="/login">Login</Link>
							</Button>
						)}
					</nav>
				</div>
				<div className="mt-2 md:hidden">
					<form className="relative">
						<Input
							type="search"
							placeholder="Search products..."
							className="pl-10 pr-4 py-2 w-full"
						/>
						<Search
							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
							size={18}
						/>
					</form>
				</div>
			</div>
		</header>
	);
}
