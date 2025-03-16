"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "../components/UserProfile";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getUserProducts } from "@/services/user";
import { Button } from "@/components/ui/button";
import { Product } from "../product/[id]/page";

export default function ProfilePage() {
	const router = useRouter();
	const { user, isLoading } = useAuth();
	const [products, setProducts] = useState<Product[]>([]);
	const [nextPageData, setNextPageData] = useState<Product[] | null>(null);
	const [page, setPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);
	const limit = 10;

	// Fetch products
	const fetchProducts = async (page: number) => {
		try {
			const response = await getUserProducts(limit, page);
			return response?.success ? response.data.products || [] : [];
		} catch (error) {
			console.error("Error fetching products:", error);
			return [];
		}
	};

	// Load initial page and prefetch next
	useEffect(() => {
		if (!isLoading && !user) {
			router.push("/login");
			return;
		}

		if (user) {
			(async () => {
				const currentProducts = await fetchProducts(page);
				setProducts(currentProducts);

				// Prefetch next page
				const nextProducts = await fetchProducts(page + 1);
				setNextPageData(nextProducts.length > 0 ? nextProducts : null);
				setHasNextPage(nextProducts.length > 0);
			})();
		}
	}, [user, isLoading, page]);

	// Handle next page switch
	const handleNextPage = () => {
		if (nextPageData) {
			setProducts(nextPageData);
			setPage((prev) => prev + 1);
			setNextPageData(null); // Clear prefetched data
		}
	};

	const handlePreviousPage = () => {
		setPage((prev) => prev - 1);
	};

	const hasPreviousPage = page > 1;

	if (isLoading || (!isLoading && user == null)) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<UserProfile user={user} />

			{/* Products Section */}
			{products.length > 0 ? (
				<>
					<div className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((item) => (
							<ProductCard key={item.id} product={item} />
						))}
					</div>

					{/* Pagination Controls */}
					<div className="flex justify-center mt-6 space-x-4">
						<Button
							disabled={!hasPreviousPage}
							onClick={handlePreviousPage}>
							Previous
						</Button>
						<span className="text-gray-600 text-lg">
							Page {page}
						</span>
						<Button
							disabled={!hasNextPage}
							onClick={handleNextPage}>
							Next
						</Button>
					</div>
				</>
			) : (
				<p className="text-center text-gray-500 mt-8">
					No products found.
				</p>
			)}
		</div>
	);
}
