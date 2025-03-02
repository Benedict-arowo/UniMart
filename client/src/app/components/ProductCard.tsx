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
}

export function ProductCard({ product, isHotDeal = false }: ProductCardProps) {
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { user } = useAuth();

	const toggleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsWishlisted(!isWishlisted);
		// Here you would typically call an API to update the wishlist
		console.log(
			`${isWishlisted ? "Removed from" : "Added to"} wishlist:`,
			product.id
		);
	};

	return (
		<Card
			className={`hover:shadow-lg transition-shadow min-w-[288px] w-72 duration-200 ${
				isHotDeal ? "border-hot-deal" : ""
			}`}>
			<Link href={`/product/${product.id}`}>
				<CardHeader className="p-0">
					<Image
						src={
							(product.media &&
								product.media.length >= 1 &&
								product.media[0].url) ||
							"/images/placeholder.svg"
						}
						alt={product.name}
						width={200}
						unoptimized
						draggable={false}
						height={200}
						className="w-full h-48 object-cover rounded-t-lg"
					/>
				</CardHeader>
				<CardContent className="p-4">
					<CardTitle
						className={`text-lg ${
							isHotDeal ? "text-hot-deal" : ""
						}`}>
						{product.name}
					</CardTitle>
					<div className="mt-2">
						{product.discountedPrice ? (
							<>
								<span className="text-gray-400 line-through mr-2">
									${product.price}
								</span>
								<span
									className={`font-bold ${
										isHotDeal
											? "text-hot-deal"
											: "text-green-600"
									}`}>
									${product.discountedPrice}
								</span>
							</>
						) : (
							<span
								className={`font-bold ${
									isHotDeal ? "text-hot-deal" : ""
								}`}>
								${product.price}
							</span>
						)}
					</div>
				</CardContent>
				<CardFooter className="p-4 pt-0 flex justify-between">
					{user && (
						<Button
							variant="outline"
							size="sm"
							onClick={toggleWishlist}
							className={
								isWishlisted
									? "bg-primary text-primary-foreground"
									: ""
							}>
							<Heart
								className="mr-2"
								size={16}
								fill={isWishlisted ? "currentColor" : "none"}
							/>
							{isWishlisted ? "Wishlisted" : "Add to Wishlist"}
						</Button>
					)}
					<Button
						size="sm"
						className={`${!user && "w-full"}
							${isHotDeal ? "bg-hot-deal hover:bg-hot-deal/90" : ""}`}>
						View Details
					</Button>
				</CardFooter>
			</Link>
		</Card>
	);
}
