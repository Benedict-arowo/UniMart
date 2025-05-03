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
import { getProduct, getSimilarProducts } from "@/services/product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { createComment, getComments } from "@/services/comment";
import { format } from "timeago.js";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getReviews } from "@/services/review";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
export interface Product {
	id: string;
	name: string;
	price: number;
	media: {
		id: string;
		url: string;
		type: "IMAGE";
		public_id: string;
		productId: string;
		createdAt: Date;
	}[];
	isBoosted: boolean;
	boostedAt: null | Date;
	boostExpiresAt: null | Date;
	description: string;
	discountedPrice?: number;
	owner: {
		id: string;
		username: string;
		email: string;
		isOnline: boolean;
		lastOnline: Date;
		createdAt: Date;
	};
	ownerId: string;
	condition: string;
	rating: number;
	category: string;
}

export interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	productId: string;
	userId: string;
	createdBy: {
		id: string;
		username: string;
		email: string;
		lastOnline: null | Date;
		isOnline: boolean;
		isVerified: boolean;
		createdAt: Date;
	};
}

export interface Review {
	id: "68524cad-ace8-409e-b8f0-bada574d5519";
	content: "Cool";
	rating: 5;
	productId: "10c7a3fe-e55b-4d78-9530-e598754bf8dd";
	userId: "7f02db15-c18b-4365-8895-9dbfd45b7889";
	createdAt: "2025-04-10T15:04:05.947Z";
	reviewer: {
		id: "7f02db15-c18b-4365-8895-9dbfd45b7889";
		username: "ibrahimyohanna29_u";
		email: "ibrahimyohanna29@gmail.com";
		lastOnline: null;
		isOnline: false;
		isVerified: true;
		createdAt: "2025-03-23T02:51:15.038Z";
	};
}

export default function ProductPage({ params }: { params: { id: string } }) {
	const [product, setProduct] = useState<Product | null>(null);
	const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
	const [comments, setComments] = useState<Comment[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const [newComment, setNewComment] = useState("");
	const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
	const [showRating, setShowRating] = useState(false);
	const {
		wishlist,
		isLoading: wishlistIsLoading,
		handleAddWishlist,
		handleRemoveWishlist,
	} = useWishlist();
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		setIsWishlisted(() =>
			wishlistIsLoading || product === null
				? false
				: wishlist.find((item) => item.id === product.id || "")
				? true
				: false
		);
	}, [wishlist, wishlistIsLoading, product]);

	useEffect(() => {
		if (!product) return;

		const recentlyViewed = JSON.parse(
			localStorage.getItem("recently_viewed") || "[]"
		) as Product[];

		setRecentlyViewedProducts(() => recentlyViewed);

		// Check if product already exists in the list
		const exists = recentlyViewed.some((p) => p.id === product.id);
		if (!exists) {
			const updatedProducts = [product, ...recentlyViewed.slice(0, 8)]; // Keep max 9 items

			localStorage.setItem(
				"recently_viewed",
				JSON.stringify(updatedProducts)
			);
		}
	}, [product]);

	useEffect(() => {
		const fetchProduct = async () => {
			const response = await getProduct(params.id);
			if (!response.success) throw new Error("Failed to get product.");
			setProduct(response.data.product);
		};

		const fetchSimilarProduct = async () => {
			const response = await getSimilarProducts(params.id);
			if (!response.success) throw new Error("Failed to get product.");
			setSimilarProducts(response.data.products);
		};
		const fetchComments = async () => {
			const response = await getComments(params.id, 10, 1, true);
			if (!response.success) throw new Error("Failed to get comments.");
			setComments(response.data.comments);
		};
		const fetchReviews = async () => {
			const response = await getReviews(params.id, 10, 1, true);
			if (!response.success) throw new Error("Failed to fetch reviews.");
			setReviews(response.data.reviews);
		};

		(async () => {
			try {
				setIsLoading(true);

				await fetchProduct();
				await fetchSimilarProduct();
				// await fetchComments();
				await fetchReviews();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		})();

		// Check if 24 hours have passed since first contact (simulated here)
		const contactTime = localStorage.getItem(
			`contactTime_${product?.ownerId}`
		);
		if (
			contactTime &&
			Date.now() - Number.parseInt(contactTime) > 24 * 60 * 60 * 1000
		) {
			setShowRating(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
					product.media.length
			);
	};

	const renderStars = (rating: number) => {
		return (
			<div className="flex gap-1 text-yellow-500">
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						size={16}
						fill={i < rating ? "currentColor" : "none"}
						strokeWidth={1}
					/>
				))}
			</div>
		);
	};

	const handleCommentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newComment.trim().length === 0) return;

		try {
			const response = await createComment(product.id, newComment);

			if (response?.success) {
				setNewComment("");
				setComments((prev) => [...prev, response.data.comment]);
			} else {
				console.error("Failed to submit comment");
			}
		} catch (error) {
			console.error("Error submitting comment:", error);
		}
	};

	const handleChatWithSeller = (id: string) => {
		// Simulate first contact time
		if (!localStorage.getItem(`contactTime_${product.ownerId}`)) {
			localStorage.setItem(
				`contactTime_${product.ownerId}`,
				Date.now().toString()
			);
		}

		router.push(`/messages?vendorId=${id}`);
		// Here you would typically open the chat with the seller
		console.log("Chat with seller:", product.ownerId);
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

	if (!isLoading && !product) {
		return router.push("/404");
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="relative h-full bg-white p-4 rounded-lg shadow-md">
					{product.media &&
					product.media[currentMediaIndex].type === "IMAGE" ? (
						<Image
							src={
								(product.media &&
									product.media[currentMediaIndex].url) ||
								"/images/placeholder.svg"
							}
							alt={product.name}
							unoptimized
							width={400}
							height={500}
							className="w-full h-[500px] object-cover object-center"
						/>
					) : (
						<video
							src={
								product.media &&
								product.media[currentMediaIndex].url
							}
							controls
							className="w-full h-full"
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
						<CardDescription className="font-medium">
							Sold by{" "}
							<Link href={`/profile/${product.ownerId}`}>
								{product.owner.username}
							</Link>
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
						{product.discountedPrice ? (
							<div className="flex flex-col gap-1 mb-4">
								<p className="text-xl font-medium text-gray-500 line-through">
									₦{product.price.toLocaleString()}
								</p>
								<p className="text-4xl font-bold text-green-600">
									₦{product.discountedPrice.toLocaleString()}
								</p>
								<span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold w-fit">
									{Math.round(
										((product.price -
											product.discountedPrice) /
											product.price) *
											100
									)}
									% OFF
								</span>
							</div>
						) : (
							<p className="text-4xl font-bold text-gray-900 mb-4">
								₦{product.price.toLocaleString()}
							</p>
						)}

						<p className="mb-2">
							<strong>Description:</strong>
						</p>
						<p className="text-gray-700">{product.description}</p>
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						{user && product.ownerId !== user.id && (
							<Button
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
								onClick={() =>
									handleChatWithSeller(product.ownerId)
								}>
								<MessageCircle className="mr-2" size={20} />
								Chat with Seller
							</Button>
						)}
						{user && (
							<Button
								onClick={() =>
									isWishlisted
										? handleRemoveWishlist(product.id)
										: handleAddWishlist(product)
								}
								variant="outline"
								className={`w-full ${
									isWishlisted
										? "!bg-red-500 !text-white"
										: ""
								}`}>
								<Heart
									size={16}
									className="transition-colors"
									fill={
										isWishlisted ? "currentColor" : "none"
									}
								/>
								{isWishlisted
									? "Remove from Wishlist"
									: "Add to Wishlist"}
							</Button>
						)}
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
				<Swiper
					modules={[Navigation]}
					slidesPerView={1.2}
					spaceBetween={10}
					direction="horizontal"
					loop={true}
					pagination={{ clickable: true }}
					navigation={true}
					breakpoints={{
						480: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 4 },
					}}>
					{similarProducts.map((item) => (
						<SwiperSlide key={item.id}>
							<ProductCard product={item} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
				<div className="space-y-4 mb-6">
					{reviews.map((review) => (
						<Card
							key={review.id}
							className="rounded-2xl shadow-md border border-gray-200">
							<CardHeader className="flex flex-row justify-between items-start gap-4">
								<div>
									<CardTitle className="text-base font-semibold">
										{review.reviewer.username ||
											"Anonymous"}
									</CardTitle>
									<CardDescription className="text-sm text-muted-foreground">
										{format(new Date(review.createdAt))}
									</CardDescription>
								</div>
								{renderStars(review.rating)}
							</CardHeader>
							<CardContent>
								<p className="text-gray-800 max-h-40 overflow-y-auto break-words">
									{review.content}
								</p>
							</CardContent>
						</Card>
					))}
					{reviews.length === 0 && (
						<p className="text-center text-gray-500">
							There are currently no comments here.
						</p>
					)}
				</div>
			</div>

			{showRating && user && (
				<div className="mt-12">
					<SellerRating
						productId={product.id}
						sellerName={product.owner.username}
						updateReviews={setReviews}
					/>
				</div>
			)}

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
				<div>
					<Swiper
						modules={[Navigation]}
						slidesPerView={1.2}
						spaceBetween={10}
						loop={true}
						pagination={{ clickable: true }}
						navigation={true}
						breakpoints={{
							480: { slidesPerView: 2 },
							768: { slidesPerView: 3 },
							1024: { slidesPerView: 4 },
						}}>
						{recentlyViewedProducts.map((item) => (
							<SwiperSlide key={item.id}>
								<ProductCard product={item} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
}
