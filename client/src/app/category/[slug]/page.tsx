"use client";

import { AdSpot } from "@/app/components/ads/AdSpot";
import { ProductCard } from "@/app/components/ProductCard";
import { ProductCardSkeleton } from "@/app/components/ProductCardSkeleton";
import { useState, useEffect } from "react";
// Mock data for demonstration
const categoryItemsMock = [
	{
		id: 1,
		name: "Textbook: Introduction to Computer Science",
		price: 50,
		image: "/images/placeholder.svg",
	},
	{
		id: 2,
		name: "Textbook: Calculus I",
		price: 45,
		image: "/images/placeholder.svg",
	},
	{
		id: 3,
		name: "Textbook: Introduction to Psychology",
		price: 40,
		image: "/images/placeholder.svg",
	},
	{
		id: 4,
		name: "Textbook: World History",
		price: 55,
		image: "/images/placeholder.svg",
	},
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
	const [categoryItems, setCategoryItems] = useState<
		{ id: number; name: string; price: number; image: string }[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const categoryName = params.slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	useEffect(() => {
		const fetchCategoryItems = async () => {
			setIsLoading(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setCategoryItems(categoryItemsMock);
			setIsLoading(false);
		};
		fetchCategoryItems();
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">
				{categoryName}
			</h1>

			{/* Top Banner Ad */}
			<div className="mb-8">
				<AdSpot
					style="banner"
					className="w-full"
					adSlot="category-top-banner"
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{isLoading
					? [...Array(8)].map((_, index) => (
							<ProductCardSkeleton key={index} />
					  ))
					: categoryItems.map((item) => (
							<ProductCard key={item.id} product={item} />
					  ))}
			</div>

			<div className="my-8">
				<AdSpot
					style="banner"
					className="w-full"
					adSlot="category-bottom-banner"
				/>
			</div>
		</div>
	);
}
