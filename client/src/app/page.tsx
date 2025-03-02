"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AdBanner } from "./components/ads/AdBanner";
import { ProductCard } from "./components/ProductCard";
import { SearchFilters } from "./components/SearchFilters";
import { ProductCardSkeleton } from "./components/ProductCardSkeleton";
import { AdSpot } from "./components/ads/AdSpot";
import { getProducts } from "@/services/product";
import { Product } from "./product/[id]/page";
import { getStores } from "@/services/store";
import { getCategories } from "@/services/category";

export default function Home() {
	const [products, setProducts] = useState<IProductState>({
		products: [],
		page: 1,
		limit: 12,
	});

	const [featuredProducts, setFeaturedProducts] = useState<IProductState>({
		products: [],
		page: 1,
		limit: 6,
	});

	const [categories, setCategories] = useState<ICategory[]>([]);
	const [featuredStores, setFeaturedStores] = useState<IStore[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	// const [page, setPage] = useState(1);
	const [_filters, setFilters] = useState({});
	// const { ref, inView } = useInView();
	const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

	const fetchProducts = async ({
		page = 1,
		limit = 10,
		featured,
	}: {
		page: number;
		limit: number;
		featured: boolean;
	}) => {
		try {
			const response = await getProducts(
				limit,
				page,
				undefined,
				featured
			);
			if (!response.success) throw new Error("Failed to get products.");

			return response.data.products;
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	const fetchCategories = async (limit, page) => {
		try {
			const response = await getCategories(limit, page);
			if (!response.success) throw new Error("Failed to get categories.");

			return response.data.categories;
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const fetchStores = async ({
		page = 1,
		limit = 10,
		featured,
	}: {
		page: number;
		limit: number;
		featured: boolean;
	}) => {
		try {
			const response = await getStores(limit, page, undefined, featured);
			if (!response.success) throw new Error("Failed to get stores.");
			console.log(response.data);
			return response.data.stores;
		} catch (error) {
			console.error("Error fetching stores:", error);
		}
	};

	useEffect(() => {
		const recentlyViewedProducts = JSON.parse(
			localStorage.getItem("recently_viewed") || "[]"
		);

		setRecentlyViewedProducts(() => recentlyViewedProducts);

		(async () => {
			setIsLoading(true);
			const new_products = await fetchProducts({
				page: products.page,
				limit: products.limit,
				featured: false,
			});

			const new_featuredProducts = await fetchProducts({
				page: featuredProducts.page,
				limit: featuredProducts.limit,
				featured: true,
			});

			const stores = await fetchStores({
				page: 1,
				limit: 6,
				featured: true,
			});

			const categories = await fetchCategories(6, 1);

			setProducts((prev) => ({ ...prev, products: new_products }));
			setFeaturedProducts((prev) => ({
				...prev,
				products: new_featuredProducts,
			}));
			setFeaturedStores(() => stores);
			setCategories(() => categories);

			setIsLoading(false);
		})();
	}, []);

	// useEffect(() => {
	// 	if (inView) {
	// 		console.log("Loading");
	// 		loadMore();
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [inView]);

	// const loadMore = async () => {
	// 	setIsLoading(true);
	// 	// Simulate API call
	// 	await new Promise((resolve) => setTimeout(resolve, 1000));
	// 	const nextProducts = allProducts.slice(page * 6, (page + 1) * 6);
	// 	setProducts([...products, ...nextProducts]);
	// 	setPage(page + 1);
	// 	setIsLoading(false);
	// };

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
						<div className="grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{isLoading
								? [
										...Array(
											featuredProducts.limit *
												featuredProducts.page
										),
								  ].map((_, index) => (
										<ProductCardSkeleton key={index} />
								  ))
								: featuredProducts.products.map((item) => (
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
						<div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.products.map((item) => (
								<ProductCard key={item.id} product={item} />
							))}
							{isLoading &&
								[...Array(products.limit * products.page)].map(
									(_, index) => (
										<ProductCardSkeleton
											key={`skeleton-${index}`}
										/>
									)
								)}
						</div>
						{/* {products.products.length < allProducts.length && (
							<div ref={ref} className="flex justify-center mt-6">
								<Button onClick={loadMore} disabled={isLoading}>
									{isLoading ? "Loading..." : "Load More"}
								</Button>
							</div>
						)} */}
					</section>

					<section className="bg-secondary p-6 rounded-lg">
						<h2 className="text-2xl font-bold mb-6">Categories</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							{categories.map((category) => (
								<Link
									key={category.name}
									href={`/category/${category.name
										.toLowerCase()
										.replace(" ", "-")}`}>
									<Card className="hover:shadow-lg transition-shadow duration-200">
										<CardHeader>
											<CardTitle className="text-center text-sm">
												{category.name}
											</CardTitle>
										</CardHeader>
									</Card>
								</Link>
							))}
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-bold mb-6">Top Stores</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
							{featuredStores.map((store) => (
								<Link
									key={store.id}
									href={`/store/${store.id}`}>
									<Card className="hover:shadow-lg transition-shadow duration-200">
										<CardContent className="flex items-center p-4">
											<Image
												src={
													// store.image ||
													"/images/placeholder.svg"
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
												{store.isActive && (
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

					<AdSpot
						style="banner"
						className="w-full"
						adSlot="home-horizontal-1"
					/>
				</div>
			</div>
		</div>
	);
}

interface IProductState {
	products: Product[];
	page: number;
	limit: number;
}

interface ICategory {
	name: string;
	_count: {
		products: number;
	};
}

interface IStore {
	id: string;
	name: string;
	description: string;
	customUrl: string | null;
	isActive: boolean;
	isBoosted: boolean;
	boostedAt: Date | null;
	boostExpiresAt: Date | null;
	ownerId: string;
}
