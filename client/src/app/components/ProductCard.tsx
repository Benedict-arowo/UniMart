"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "../product/[id]/page";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const { user } = useAuth();
	const { wishlist, handleAddWishlist, handleRemoveWishlist } = useWishlist();

	const isWishlisted = wishlist.find((item) => item.id === product.id);

	const discountPercentage = product.discountedPrice
		? Math.round(
				((product.price - product.discountedPrice) / product.price) *
					100
		  )
		: 0;

	return (
		<Card className="hover:shadow-2xl min-w-[300px] max-w-[300px] transition-shadow duration-300 overflow-hidden rounded-lg relative bg-white">
			<Link href={`/product/${product.id}`} className="block">
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
						className="w-full h-56 object-cover rounded-t-lg transition-transform duration-200 hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-t-lg"></div>

					{product.isBoosted && (
						<span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg">
							Boosted
						</span>
					)}

					{discountPercentage > 0 && (
						<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg">
							-{discountPercentage}%
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
									₦{product.price}
								</span>
								<span className="text-green-600 font-bold text-lg">
									₦{product.discountedPrice}
								</span>
							</>
						) : (
							<span className="font-bold text-lg">
								₦{product.price}
							</span>
						)}
					</div>
				</CardContent>

				<CardFooter className="p-4 flex justify-between items-center">
					{user && (
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								return isWishlisted
									? handleRemoveWishlist(product.id)
									: handleAddWishlist(product);
							}}
							className={`transition-all flex z-10 items-center gap-2 ${
								isWishlisted ? "bg-red-500 text-white" : ""
							}`}>
							<Heart
								size={16}
								className="transition-colors"
								fill={isWishlisted ? "currentColor" : "none"}
							/>
							{isWishlisted ? "Wishlisted" : "Wishlist"}
						</Button>
					)}
					<Button
						size="sm"
						className="bg-blue-600 text-white hover:bg-blue-500 transition-all">
						View
					</Button>
				</CardFooter>
			</Link>
		</Card>
	);
}
