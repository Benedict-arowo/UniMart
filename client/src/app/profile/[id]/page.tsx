"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserProfile } from "../../components/UserProfile";
import { getOtherUser, getOtherUserProducts } from "@/services/user";
import { ProductCard } from "@/app/components/ProductCard";

export default function ProfilePage({ params }: { params: { id: string } }) {
	const [user, setUser] = useState(null);
	const [products, setProducts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	// Fetch user details
	useEffect(() => {
		(async () => {
			try {
				const response = await getOtherUser(params.id);
				setUser(response.data);
			} catch (error) {
				router.push("/404");
			}
		})();
	}, [params.id]);

	// Fetch products & check for next page
	useEffect(() => {
		(async () => {
			try {
				const page = parseInt(searchParams.get("page") || "1");

				// Fetch current page products
				const response = await getOtherUserProducts(params.id, 1, page);
				setProducts(response.data.products);
				setCurrentPage(page);

				// Try fetching next page to check if it exists
				const nextPageResponse = await getOtherUserProducts(
					params.id,
					1,
					page + 1
				);
				setHasNextPage(nextPageResponse.data.products.length > 0);
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		})();
	}, [params.id, searchParams]);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* User Profile Section */}
			<UserProfile user={user} />

			{/* Products Section */}
			<div className="mt-8">
				<h2 className="text-2xl font-semibold mb-4">Products</h2>
				{products.length === 0 ? (
					<p className="text-gray-500">No products available.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>

			{/* Pagination Controls */}
			<div className="flex justify-center items-center gap-4 mt-6">
				{currentPage > 1 && (
					<button
						onClick={() => router.push(`?page=${currentPage - 1}`)}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
						Previous
					</button>
				)}
				<span>Page {currentPage}</span>
				{hasNextPage && (
					<button
						onClick={() => router.push(`?page=${currentPage + 1}`)}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
						Next
					</button>
				)}
			</div>
		</div>
	);
}
