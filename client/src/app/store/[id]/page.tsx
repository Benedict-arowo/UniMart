"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductCard } from "@/app/components/ProductCard";
import Image from "next/image";

interface Product {
	id: number;
	name: string;
	price: number;
	discountedPrice?: number;
	image: string;
}

interface Store {
	id: number;
	name: string;
	description: string;
	bannerImage: string;
}

// Mock data for demonstration
const store: Store = {
	id: 1,
	name: "John's Textbook Emporium",
	description: "Your one-stop shop for all your textbook needs!",
	bannerImage: "/images/banner-placeholder.svg",
};

const products: Product[] = [
	{
		id: 1,
		name: "Introduction to Computer Science",
		price: 50,
		discountedPrice: 40,
		image: "/images/placeholder.svg",
	},
	{
		id: 2,
		name: "Calculus I",
		price: 45,
		image: "/images/placeholder.svg",
	},
	{
		id: 3,
		name: "Introduction to Psychology",
		price: 40,
		discountedPrice: 35,
		image: "/images/placeholder.svg",
	},
	{
		id: 4,
		name: "World History",
		price: 55,
		image: "/images/placeholder.svg",
	},
];

export default function StorePage({ params }: { params: { id: string } }) {
	const [storeData, _setStoreData] = useState<Store>(store);
	const [storeProducts, _setStoreProducts] = useState<Product[]>(products);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		// In a real app, you'd fetch the store data and products from an API here
		// using the params.id
	}, [params.id]);

	const filteredProducts = storeProducts.filter((product) =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div>
			<header className="relative">
				<Image
					src={storeData.bannerImage}
					alt={storeData.name}
					className="w-full h-[300px] object-cover"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<h1 className="text-4xl font-bold text-white">
						{storeData.name}
					</h1>
				</div>
			</header>

			<main className="container mx-auto p-6">
				<div className="mb-6 relative">
					<Input
						type="text"
						placeholder="Search products..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
						size={20}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</main>
		</div>
	);
}
