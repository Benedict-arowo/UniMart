"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AdBanner } from "./components/AdBanner";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "./components/ProductCard";
import { SearchFilters } from "./components/SearchFilters";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";

interface Product {
	id: number;
	name: string;
	price: number;
	discountedPrice?: number;
	image: string;
}

const allProducts: Product[] = [
	{
		id: 1,
		name: "Textbook: Introduction to Computer Science",
		price: 50,
		image: "images/placeholder.svg",
	},
	{
		id: 2,
		name: "Laptop Backpack",
		price: 30,
		discountedPrice: 25,
		image: "images/placeholder.svg",
	},
	{
		id: 3,
		name: "Scientific Calculator",
		price: 15,
		image: "images/placeholder.svg",
	},
	{
		id: 4,
		name: "USB Flash Drive 32GB",
		price: 10,
		image: "images/placeholder.svg",
	},
	{
		id: 5,
		name: "Wireless Mouse",
		price: 20,
		discountedPrice: 15,
		image: "images/placeholder.svg",
	},
	{
		id: 6,
		name: "Noise-Cancelling Headphones",
		price: 80,
		image: "images/placeholder.svg",
	},
	// Add more products here...
];

const categories = [
	"Textbooks",
	"Electronics",
	"Stationery",
	"Dorm Essentials",
	"Clothing",
	"Food & Snacks",
];

const topStores = [
	{
		id: 1,
		name: "John's Textbook Emporium",
		image: "/images/placeholder.svg",
		verified: true,
	},
	{
		id: 2,
		name: "Tech Haven",
		image: "/images/placeholder.svg",
		verified: false,
	},
	{
		id: 3,
		name: "Campus Essentials",
		image: "/images/placeholder.svg",
		verified: true,
	},
];

const featuredProducts: Product[] = [
	{
		id: 7,
		name: "Premium Notebook Set",
		price: 25,
		image: "images/placeholder.svg",
	},
	{
		id: 8,
		name: "Ergonomic Desk Chair",
		price: 120,
		discountedPrice: 99,
		image: "images/placeholder.svg",
	},
	{
		id: 9,
		name: "Smart Desk Lamp",
		price: 40,
		image: "images/placeholder.svg",
	},
];

const recentlyViewedProducts: Product[] = [
	{
		id: 10,
		name: "Coffee Maker",
		price: 35,
		image: "images/placeholder.svg",
	},
	{
		id: 11,
		name: "Portable Charger",
		price: 20,
		image: "images/placeholder.svg",
	},
	{
		id: 12,
		name: "Wireless Keyboard",
		price: 45,
		image: "images/placeholder.svg",
	},
];

export default function Home() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState({});
	const { ref, inView } = useInView();

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setProducts(allProducts.slice(0, 6));
			setIsLoading(false);
		};
		fetchProducts();
	}, []);

	useEffect(() => {
		if (inView) {
			loadMore();
		}
	}, [inView]);

	const loadMore = async () => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		const nextProducts = allProducts.slice(page * 6, (page + 1) * 6);
		setProducts([...products, ...nextProducts]);
		setPage(page + 1);
		setIsLoading(false);
	};

	const handleFilter = (newFilters) => {
		setFilters(newFilters);
		// In a real app, you'd apply these filters to your product fetching logic
		console.log("Applying filters:", newFilters);
	};

	return (
		<div className="container mx-auto space-y-10 p-6">
			<AdBanner />

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-1">
					<SearchFilters onFilter={handleFilter} />
				</div>

				<div className="lg:col-span-3 space-y-10">
					<section>
						<h2 className="text-2xl font-bold mb-6">
							Featured Products
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{isLoading
								? [...Array(3)].map((_, index) => (
										<ProductCardSkeleton key={index} />
								  ))
								: featuredProducts.map((item) => (
										<ProductCard
											key={item.id}
											product={item}
										/>
								  ))}
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-6">
							All Products
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.map((item) => (
								<ProductCard key={item.id} product={item} />
							))}
							{isLoading &&
								[...Array(3)].map((_, index) => (
									<ProductCardSkeleton
										key={`skeleton-${index}`}
									/>
								))}
						</div>
						{products.length < allProducts.length && (
							<div ref={ref} className="flex justify-center mt-6">
								<Button onClick={loadMore} disabled={isLoading}>
									{isLoading ? "Loading..." : "Load More"}
								</Button>
							</div>
						)}
					</section>

					<section className="bg-secondary p-6 rounded-lg">
						<h2 className="text-2xl font-bold mb-6">Categories</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							{categories.map((category) => (
								<Link
									key={category}
									href={`/category/${category
										.toLowerCase()
										.replace(" ", "-")}`}>
									<Card className="hover:shadow-lg transition-shadow duration-200">
										<CardHeader>
											<CardTitle className="text-center text-sm">
												{category}
											</CardTitle>
										</CardHeader>
									</Card>
								</Link>
							))}
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-6">Top Stores</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{topStores.map((store) => (
								<Link
									key={store.id}
									href={`/store/${store.id}`}>
									<Card className="hover:shadow-lg transition-shadow duration-200">
										<CardContent className="flex items-center p-4">
											<Image
												src={
													store.image ||
													"/placeholder.svg"
												}
												alt={store.name}
												width={100}
												height={100}
												className="rounded-full mr-4"
											/>
											<div>
												<CardTitle>
													{store.name}
												</CardTitle>
												{store.verified && (
													<span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-1">
														Verified
													</span>
												)}
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-6">
							Recently Viewed
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{recentlyViewedProducts.map((item) => (
								<ProductCard key={item.id} product={item} />
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
