"use client";

import { Dispatch, SetStateAction, useState } from "react";
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
import { Star } from "lucide-react";
import { createReview } from "@/services/review";
import { toast } from "@/hooks/use-toast";
import { Review } from "../product/[id]/page";

interface SellerRatingProps {
	productId: string;
	sellerName: string;
	updateReviews: Dispatch<SetStateAction<Review[]>>;
}

export function SellerRating({
	productId,
	sellerName,
	updateReviews,
}: SellerRatingProps) {
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (comment.trim().length < 3) {
			toast({
				variant: "destructive",
				title: "Comment too short",
				description: "Please enter at least 3 characters.",
			});
			return;
		}

		const response = await createReview(productId, comment, rating);
		updateReviews((prev) => [...prev, response.data.review]);

		toast({
			title: "Review submitted!",
			description: "Thanks for rating the seller.",
		});

		// Reset form
		setRating(0);
		setComment("");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rate {sellerName}</CardTitle>
				<CardDescription>
					How was your experience with this seller?
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex mb-4">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							className={`w-6 h-6 cursor-pointer transition ${
								star <= rating
									? "text-yellow-400 fill-current"
									: "text-gray-300"
							}`}
							onClick={() => setRating(star)}
						/>
					))}
				</div>
				<Textarea
					placeholder="Leave a comment (optional)"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleSubmit}
					disabled={comment.length < 3 && rating !== 0}>
					Submit Rating
				</Button>
			</CardFooter>
		</Card>
	);
}
