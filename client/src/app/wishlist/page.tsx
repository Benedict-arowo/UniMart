"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "@/contexts/WishlistContext";

export default function WishlistPage() {
	const { wishlist, isLoading, handleRemoveWishlist } = useWishlist();
	const { toast } = useToast();

	// useEffect(() => {
	// 	const fetchWishlist = async () => {
	// 		try {
	// 			const data = await getWishlist();
	// 			setWishlistItems(data);
	// 		} catch (error: any) {
	// 			toast({
	// 				title: "Error",
	// 				description: error.message,
	// 				variant: "destructive",
	// 			});
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};
	// 	fetchWishlist();
	// }, []);

	// const handleAddWishlist = async (id: string) => {
	// 	try {
	// 		await addToWishlist(id);
	// 		setWishlistItems((prev) => [
	// 			...prev,
	// 			// { id, name: "Loading...", price: 0, image: "" },
	// 		]);
	// 		toast({ title: "Added!", description: "Item added to wishlist." });
	// 	} catch (error: any) {
	// 		toast({
	// 			title: "Error",
	// 			description: error.message,
	// 			variant: "destructive",
	// 		});
	// 	}
	// };

	// const handleRemoveWishlist = async (id: string) => {
	// 	try {
	// 		await removeFromWishlist(id);
	// 		setWishlistItems((prev) => prev.filter((item) => item.id !== id));
	// 		toast({
	// 			title: "Removed!",
	// 			description: "Item removed from wishlist.",
	// 		});
	// 	} catch (error: any) {
	// 		toast({
	// 			title: "Error",
	// 			description: error.message,
	// 			variant: "destructive",
	// 		});
	// 	}
	// };

	const copyWishlistLink = () => {
		const wishlistUrl = `${window.location.origin}/wishlist`;
		navigator.clipboard.writeText(wishlistUrl).then(
			() => toast({ title: "Wishlist link copied!" }),
			() => toast({ title: "Failed to copy", variant: "destructive" })
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
					{[...Array(4)].map((_, index) => (
						<div key={index} className="space-y-4">
							<Skeleton className="h-[200px] w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
						</div>
					))}
				</div>
			) : wishlist.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{wishlist.map((item) => (
						<div key={item.id} className="relative w-fit">
							<ProductCard product={item} />
							<Button
								variant="destructive"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => handleRemoveWishlist(item.id)}>
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
