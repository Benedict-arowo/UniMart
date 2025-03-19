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
import { getStores } from "@/services/store";
import { getCategories } from "@/services/category";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Home() {
	const [products, setProducts] = useState({
		products: [],
		page: 1,
		limit: 12,
	});
	const [featuredProducts, setFeaturedProducts] = useState({
		products: [],
		page: 1,
		limit: 3,
	});
	const [categories, setCategories] = useState([]);
	const [featuredStores, setFeaturedStores] = useState([]);
	const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const [
				newProducts,
				newFeaturedProducts,
				stores,
				fetchedCategories,
			] = await Promise.all([
				getProducts(products.limit, 1, undefined, false),
				getProducts(featuredProducts.limit, 1, undefined, true),
				getStores(6, 1, undefined, true),
				getCategories(6, 1),
			]);
			setProducts((prev) => ({
				...prev,
				products: newProducts.data.products,
			}));
			setFeaturedProducts((prev) => ({
				...prev,
				products: newFeaturedProducts.data.products,
			}));
			setFeaturedStores(stores.data.stores);
			setCategories(fetchedCategories.data.categories);
			setRecentlyViewedProducts(
				JSON.parse(localStorage.getItem("recently_viewed") || "[]")
			);
			setIsLoading(false);
		};
		fetchData();
	}, []);

	return (
		<div className="container mx-auto space-y-10 p-6">
			<AdBanner />
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
				<div className="lg:col-span-3 space-y-10">
					<section>
						<h2 className="text-3xl font-bold mb-6">
							Featured Products
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredProducts.products.map((item) => (
								<ProductCard key={item.id} product={item} />
							))}
							{isLoading &&
								Array(3)
									.fill(0)
									.map((_, i) => (
										<ProductCardSkeleton key={i} />
									))}
						</div>
					</section>
					<section>
						<h2 className="text-3xl font-bold mb-6">
							All Products
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.products.map((item) => (
								<ProductCard key={item.id} product={item} />
							))}
							{isLoading &&
								Array(products.limit)
									.fill(0)
									.map((_, i) => (
										<ProductCardSkeleton key={i} />
									))}
						</div>
					</section>
					<section>
						<h2 className="text-3xl font-bold mb-6">Top Stores</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredStores.map((store) => (
								<Link
									key={store.id}
									href={`/store/${store.id}`}>
									<Card className="hover:shadow-xl transition-shadow duration-200">
										<CardContent className="flex items-center p-4">
											<Image
												src="/images/placeholder.svg"
												alt={store.name}
												width={80}
												height={80}
												className="rounded-full"
											/>
											<div className="ml-4">
												<CardTitle>
													{store.name}
												</CardTitle>
												{store.isActive && (
													<span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
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
						<h2 className="text-3xl font-bold mb-6">Categories</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							{categories.map((category) => (
								<Link
									key={category.name}
									href={`/category/${category.name
										.toLowerCase()
										.replace(" ", "-")}`}>
									<Card className="hover:shadow-lg transition-shadow duration-200">
										<CardHeader>
											<CardTitle className="text-center text-sm capitalize">
												{category.name}
											</CardTitle>
										</CardHeader>
									</Card>
								</Link>
							))}
						</div>
					</section>
					<section>
						<h2 className="text-3xl font-bold mb-6">
							Recently Viewed
						</h2>
						<Swiper
							slidesPerView={1.2}
							spaceBetween={10}
							breakpoints={{
								640: { slidesPerView: 2 },
								1024: { slidesPerView: 3 },
							}}>
							{recentlyViewedProducts.map((item) => (
								<SwiperSlide key={item.id}>
									<ProductCard product={item} />
								</SwiperSlide>
							))}
						</Swiper>
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
