"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "../product/[id]/page";

interface ProductCardProps {
	product: Product;
	isHotDeal?: boolean;
	showButton?: boolean;
}

// export function ProductCard({
// 	product,
// 	isHotDeal = false,
// 	showButton = false,
// }: ProductCardProps) {
// 	const [isWishlisted, setIsWishlisted] = useState(false);
// 	const { user } = useAuth();

// 	const toggleWishlist = (e: React.MouseEvent) => {
// 		e.preventDefault();
// 		setIsWishlisted(!isWishlisted);
// 		// Here you would typically call an API to update the wishlist
// 		console.log(
// 			`${isWishlisted ? "Removed from" : "Added to"} wishlist:`,
// 			product.id
// 		);
// 	};

// 	return (
// 		<Card
// 			className={`hover:shadow-lg transition-shadow overflow-hidden w-[236px] duration-200 ${
// 				isHotDeal ? "border-hot-deal" : ""
// 			}`}>
// 			<Link href={`/product/${product.id}`}>
// 				<CardHeader className="p-0">
// 					<Image
// 						src={
// 							(product.media &&
// 								product.media.length >= 1 &&
// 								product.media[0].url) ||
// 							"/images/placeholder.svg"
// 						}
// 						alt={product.name}
// 						width={200}
// 						unoptimized
// 						draggable={false}
// 						height={200}
// 						className="w-full h-48 object-cover object-center rounded-t-lg"
// 					/>
// 				</CardHeader>
// 				<CardContent className="p-4">
// 					<CardTitle
// 						className={`text-lg ${
// 							isHotDeal ? "text-hot-deal" : ""
// 						}`}>
// 						{product.name}
// 					</CardTitle>
// 					<div className="mt-2">
// 						{product.discountedPrice ? (
// 							<>
// 								<span className="text-gray-400 line-through mr-2">
// 									${product.price}
// 								</span>
// 								<span
// 									className={`font-bold ${
// 										isHotDeal
// 											? "text-hot-deal"
// 											: "text-green-600"
// 									}`}>
// 									${product.discountedPrice}
// 								</span>
// 							</>
// 						) : (
// 							<span
// 								className={`font-bold ${
// 									isHotDeal ? "text-hot-deal" : ""
// 								}`}>
// 								${product.price}
// 							</span>
// 						)}
// 					</div>
// 				</CardContent>
// 				<CardFooter className="p-4 pt-0 flex justify-between">
// 					{user && (
// 						<Button
// 							variant="outline"
// 							size="sm"
// 							onClick={toggleWishlist}
// 							className={
// 								isWishlisted
// 									? "bg-primary text-primary-foreground"
// 									: ""
// 							}>
// 							<Heart
// 								className="mr-2"
// 								size={16}
// 								fill={isWishlisted ? "currentColor" : "none"}
// 							/>
// 							{isWishlisted ? "Wishlisted" : "Add to Wishlist"}
// 						</Button>
// 					)}
// 					{showButton && (
// 						<Button
// 							size="sm"
// 							className={`${!user && "w-full"}
// 							${isHotDeal ? "bg-hot-deal hover:bg-hot-deal/90" : ""}`}>
// 							View Details
// 						</Button>
// 					)}
// 				</CardFooter>
// 			</Link>
// 		</Card>
// 	);
// }

export function ProductCard({ product }: ProductCardProps) {
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { user } = useAuth();

	const toggleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsWishlisted(!isWishlisted);
	};

	return (
		<Card
			className={`hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-lg relative`}>
			<Link href={`/product/${product.id}`}>
				<CardHeader className="p-0 relative">
					<Image
						src={
							product.media?.[0]?.url || "/images/placeholder.svg"
						}
						alt={product.name}
						width={250}
						height={250}
						unoptimized
						draggable={false}
						className="w-full h-56 object-cover rounded-t-lg"
					/>
					{product.isBoosted && (
						<span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
							Boosted
						</span>
					)}
				</CardHeader>
				<CardContent className="p-4">
					<h3 className="text-lg font-semibold truncate">
						{product.name}
					</h3>
					<div className="flex items-center gap-2 mt-2">
						{product.discountedPrice ? (
							<>
								<span className="text-gray-400 line-through text-sm">
									${product.price}
								</span>
								<span className="text-green-600 font-bold text-lg">
									${product.discountedPrice}
								</span>
							</>
						) : (
							<span className="font-bold text-lg">
								${product.price}
							</span>
						)}
					</div>
				</CardContent>
				<CardFooter className="p-4 flex justify-between items-center">
					{user && (
						<Button
							variant="outline"
							size="sm"
							onClick={toggleWishlist}
							className={`${
								isWishlisted ? "bg-red-500 text-white" : ""
							}`}>
							<Heart
								size={16}
								className="mr-2"
								fill={isWishlisted ? "currentColor" : "none"}
							/>
							{isWishlisted ? "Wishlisted" : "Wishlist"}
						</Button>
					)}
					<Button
						size="sm"
						className="bg-blue-600 text-white hover:bg-blue-500">
						View
					</Button>
				</CardFooter>
			</Link>
		</Card>
	);
}
