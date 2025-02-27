"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	Heart,
	MessageCircle,
	Star,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/app/components/ProductCard";
import { SellerRating } from "@/app/components/SellerRating";
import { AdSpot } from "@/app/components/ads/AdSpot";

interface Product {
	id: number;
	name: string;
	price: number;
	media: { type: "image" | "video"; url: string }[];
	description: string;
	seller: string;
	sellerId: number;
	condition: string;
	rating: number;
	category: string;
}

const productData: Product = {
	id: 1,
	name: "Textbook: Introduction to Computer Science",
	price: 50,
	media: [
		{ type: "image", url: "/images/placeholder.svg" },
		{ type: "image", url: "/images/placeholder.svg" },
		// { type: "video", url: "https://example.com/sample-video.mp4" },
	],
	description:
		"A comprehensive textbook covering the fundamentals of computer science. Perfect for first-year students.",
	seller: "John Doe",
	sellerId: 101,
	condition: "Like New",
	rating: 4.5,
	category: "Textbooks",
};

const comments = [
	{
		id: 1,
		user: "Alice",
		content: "Great book! Helped me a lot in my CS101 class.",
		date: "2023-05-15",
	},
	{
		id: 2,
		user: "Bob",
		content:
			"The condition is as described. Very satisfied with my purchase.",
		date: "2023-05-20",
	},
];

const similarProducts: Product[] = [
	{
		id: 2,
		name: "Textbook: Calculus I",
		price: 45,
		media: [{ type: "image", url: "/images/placeholder.svg" }],
		description: "",
		seller: "Jane Smith",
		sellerId: 102,
		condition: "Good",
		rating: 4.2,
		category: "Textbooks",
	},
	{
		id: 3,
		name: "Textbook: Introduction to Psychology",
		price: 40,
		media: [{ type: "image", url: "/images/placeholder.svg" }],
		description: "",
		seller: "John Doe",
		sellerId: 101,
		condition: "Excellent",
		rating: 4.7,
		category: "Textbooks",
	},
];

export default function ProductPage({ params }: { params: { id: string } }) {
	const [product, setProduct] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [newComment, setNewComment] = useState("");
	const [userHistory, setUserHistory] = useState<Product[]>([]);
	const [showRating, setShowRating] = useState(false);

	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setProduct(productData);
			setIsLoading(false);
		};
		fetchProduct();

		// Fetch user history from localStorage
		const history = JSON.parse(localStorage.getItem("userHistory") || "[]");
		setUserHistory(history);

		// Add current product to user history
		if (product) {
			const updatedHistory = [
				product,
				...history.filter((item: Product) => item.id !== product.id),
			].slice(0, 5);
			localStorage.setItem("userHistory", JSON.stringify(updatedHistory));
		}

		// Check if 24 hours have passed since first contact (simulated here)
		const contactTime = localStorage.getItem(
			`contactTime_${product?.sellerId}`
		);
		if (
			contactTime &&
			Date.now() - Number.parseInt(contactTime) > 24 * 60 * 60 * 1000
		) {
			setShowRating(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [product, product?.sellerId]);

	const nextMedia = () => {
		if (product)
			setCurrentMediaIndex(
				(prevIndex) => (prevIndex + 1) % product.media.length!
			);
	};

	const prevMedia = () => {
		if (product)
			setCurrentMediaIndex(
				(prevIndex) =>
					(prevIndex - 1 + product.media.length!) %
					product?.media.length!
			);
	};

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("New comment:", newComment);
		// Here you would typically call an API to submit the comment
		setNewComment("");
	};

	const handleChatWithSeller = () => {
		// Simulate first contact time
		if (!localStorage.getItem(`contactTime_${product?.sellerId}`)) {
			localStorage.setItem(
				`contactTime_${product?.sellerId}`,
				Date.now().toString()
			);
		}
		// Here you would typically open the chat with the seller
		console.log("Chat with seller:", product?.sellerId);
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="grid md:grid-cols-2 gap-8">
					<Skeleton className="h-[400px] w-full" />
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-6 w-1/2" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return <div>Product not found</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="relative bg-white p-4 rounded-lg shadow-md">
					{product.media[currentMediaIndex].type === "image" ? (
						<Image
							src={
								product.media[currentMediaIndex].url ||
								"/images/placeholder.svg"
							}
							alt={product.name}
							width={400}
							height={400}
							className="w-full h-auto"
						/>
					) : (
						<video
							src={product.media[currentMediaIndex].url}
							controls
							className="w-full h-auto"
						/>
					)}
					<Button
						variant="outline"
						size="icon"
						className="absolute top-1/2 left-4 transform -translate-y-1/2"
						onClick={prevMedia}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="absolute top-1/2 right-4 transform -translate-y-1/2"
						onClick={nextMedia}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							{product.name}
						</CardTitle>
						<CardDescription>
							Sold by {product.seller}
						</CardDescription>
						<div className="flex items-center mt-2">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-5 h-5 ${
										i < Math.floor(product.rating)
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
							<span className="ml-2 text-sm text-gray-600">
								{product.rating} out of 5
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold mb-4">
							${product.price}
						</p>
						<p className="mb-2">
							<strong>Condition:</strong> {product.condition}
						</p>
						<p className="text-gray-700">{product.description}</p>
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						<Button
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
							onClick={handleChatWithSeller}>
							<MessageCircle className="mr-2" size={20} />
							Chat with Seller
						</Button>
						<Button variant="outline" className="w-full">
							<Heart className="mr-2" size={20} />
							Add to Wishlist
						</Button>
					</CardFooter>
				</Card>
			</div>

			<div className="my-12">
				<AdSpot
					style="banner"
					className="w-full"
					adSlot="product-horizontal-1"
				/>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Similar Items</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{similarProducts.map((item) => (
						<ProductCard key={item.id} product={item} />
					))}
				</div>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Comments</h2>
				<div className="space-y-4 mb-4">
					{comments.map((comment) => (
						<Card key={comment.id}>
							<CardHeader>
								<CardTitle className="text-lg">
									{comment.user}
								</CardTitle>
								<CardDescription>
									{comment.date}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{comment.content}</p>
							</CardContent>
						</Card>
					))}
				</div>
				<form onSubmit={handleCommentSubmit}>
					<Textarea
						placeholder="Write a comment..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						className="mb-2"
					/>
					<Button type="submit">Post Comment</Button>
				</form>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{userHistory.map((item) => (
						<ProductCard key={item.id} product={item} />
					))}
				</div>
			</div>

			{showRating && (
				<div className="mt-12">
					<SellerRating
						sellerId={product.sellerId}
						sellerName={product.seller}
					/>
				</div>
			)}
		</div>
	);
}
