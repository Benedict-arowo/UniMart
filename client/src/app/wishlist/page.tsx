"use client";

import { useState, useEffect } from "react";
// import { ProductCard } from "../components/ProductCard"
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/components/ui/use-toast"
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "../components/ProductCard";

interface Product {
	id: number;
	name: string;
	price: number;
	discountedPrice?: number;
	image: string;
}

export default function WishlistPage() {
	const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		// Simulate API call
		const fetchWishlist = async () => {
			await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
			setWishlistItems([
				{
					id: 1,
					name: "Textbook: Introduction to Computer Science",
					price: 50,
					discountedPrice: 40,
					image: "/images/placeholder.svg",
				},
				{
					id: 2,
					name: "Laptop Backpack",
					price: 30,
					image: "/images/placeholder.svg",
				},
				{
					id: 3,
					name: "Scientific Calculator",
					price: 15,
					image: "/images/placeholder.svg",
				},
			]);
			setIsLoading(false);
		};
		fetchWishlist();
	}, []);

	const removeFromWishlist = (productId: number) => {
		setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
	};

	const copyWishlistLink = () => {
		const wishlistUrl = `${window.location.origin}/wishlist`;
		navigator.clipboard.writeText(wishlistUrl).then(
			() => {
				toast({
					title: "Wishlist link copied!",
					description: "You can now share your wishlist with others.",
				});
			},
			(err) => {
				console.error("Could not copy text: ", err);
				toast({
					title: "Failed to copy",
					description: "Please try again.",
					variant: "destructive",
				});
			}
		);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">My Wishlist</h1>
				<Button onClick={copyWishlistLink}>
					<Copy className="mr-2 h-4 w-4" /> Copy Wishlist Link
				</Button>
			</div>
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(3)].map((_, index) => (
						<div key={index} className="space-y-4">
							<Skeleton className="h-[200px] w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					))}
				</div>
			) : wishlistItems.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{wishlistItems.map((item) => (
						<div key={item.id} className="relative">
							<ProductCard product={item} />
							<Button
								variant="destructive"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => removeFromWishlist(item.id)}>
								Remove
							</Button>
						</div>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500">
					Your wishlist is empty.
				</p>
			)}
		</div>
	);
}
