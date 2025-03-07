"use client";

import { AdSpot } from "@/app/components/ads/AdSpot";
import { ProductCard } from "@/app/components/ProductCard";
import { ProductCardSkeleton } from "@/app/components/ProductCardSkeleton";
import { Product } from "@/app/product/[id]/page";
import { getItemsInCategory } from "@/services/category";
import { useState, useEffect } from "react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
	const [categoryItems, setCategoryItems] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const categoryName = params.slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	const getItems = async (limit: number, page: number) => {
		try {
			const response = await getItemsInCategory(params.slug, limit, page);
			if (!response.success) throw new Error("Failed to get products.");

			return response.data.products;
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			const products = await getItems(50, 1);

			setCategoryItems(() => products);

			setIsLoading(false);
		})();
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
