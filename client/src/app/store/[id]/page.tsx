"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ProductCard } from "@/app/components/ProductCard";
import Image from "next/image";
import { getStore, getStoreProducts } from "@/services/store";
import { useRouter } from "next/navigation";

// Skeleton loader component
const SkeletonLoader = () => (
	<div className="animate-pulse">
		<div className="bg-gray-200 h-[300px] rounded-lg mb-6"></div>
		<div className="space-y-2">
			<div className="bg-gray-200 h-8 w-1/4 rounded"></div>
			<div className="bg-gray-200 h-6 w-1/2 rounded"></div>
			<div className="bg-gray-200 h-12 w-full rounded"></div>
		</div>
	</div>
);

interface Product {
	id: number;
	name: string;
	price: number;
	discountedPrice?: number;
	image: string;
}

interface Store {
	id: "a14a22c3-7f8d-4efc-aba6-cc4177127935";
	name: "GirlsVen";
	description: "The best place for your shoes, and clothes!";
	customUrl: null;
	isActive: true;
	isBoosted: null;
	boostedAt: null;
	boostExpiresAt: null;
	ownerId: "7f02db15-c18b-4365-8895-9dbfd45b7889";
	banner: {
		id: "8301ee90-5a05-4062-8453-ee2af11bafda";
		type: "IMAGE";
		url: "https://res.cloudinary.com/dctbkswpr/image/upload/v1744296694/uploads/products/bcvhwesati3aukshidms.png";
		createdAt: "2025-04-10T14:51:35.801Z";
	};
}

export default function StorePage({ params }: { params: { id: string } }) {
	const [storeData, setStoreData] = useState<Store | null>(null);
	const [storeProducts, setStoreProducts] = useState<Product[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const router = useRouter();

	useEffect(() => {
		// Fetch the store data and products when the component mounts
		const getStoreData = async () => {
			const { data } = await getStore(params.id);
			const {
				data: { products },
			} = await getStoreProducts(params.id, 10, 1, "", undefined);

			if (!data.store) {
				router.replace("/404");
			}

			setStoreData(data.store);
			setStoreProducts(products);
		};

		getStoreData();
	}, [params.id]);

	const filteredProducts = storeProducts.filter((product) =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (!storeData) {
		return (
			<div className="container mx-auto p-6">
				<SkeletonLoader />
			</div>
		);
	}

	return (
		<div>
			<header className="relative">
				<Image
					src={storeData.banner?.url}
					alt={storeData.name}
					unoptimized
					fill
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
				{filteredProducts.length === 0 && (
					<p className="mt-3 text-center text-gray-500">
						There are currently no products in this store.
					</p>
				)}
			</main>
		</div>
	);
}
