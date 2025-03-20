"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
	addToWishlist,
	getWishlist,
	removeFromWishlist,
} from "@/services/wishlist";
import { Product } from "@/app/product/[id]/page";

interface WishlistContextType {
	wishlist: Product[];
	isLoading: boolean;
	handleAddWishlist: (produt: Product) => Promise<void>;
	handleRemoveWishlist: (id: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
	undefined
);

export const WishlistProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [wishlist, setWishlist] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const data = await getWishlist();
				setWishlist(data);
			} catch (error: any) {
				toast({
					title: "Error fetching wishlist",
					description: error.message,
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchWishlist();
	}, []);

	const handleAddWishlist = async (product: Product) => {
		try {
			await addToWishlist(product.id);

			setWishlist((prev) => [...prev, product]);
			toast({ title: "Added!", description: "Item added to wishlist." });
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	const handleRemoveWishlist = async (id: string) => {
		try {
			await removeFromWishlist(id);
			setWishlist((prev) => prev.filter((item) => item.id !== id));
			toast({
				title: "Removed!",
				description: "Item removed from wishlist.",
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	return (
		<WishlistContext.Provider
			value={{
				wishlist,
				isLoading,
				handleAddWishlist,
				handleRemoveWishlist,
			}}>
			{children}
		</WishlistContext.Provider>
	);
};

// Custom hook to use wishlist context
export const useWishlist = () => {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
};
