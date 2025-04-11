"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getUserReviews } from "@/services/review";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
	id: "875d4a5d-35cd-4c6d-95ba-520807391515";
	content: "cool";
	rating: 5;
	productId: "12bc9749-9dc6-4ba4-ad26-4f157d839d87";
	userId: "7f02db15-c18b-4365-8895-9dbfd45b7889";
	createdAt: "2025-04-11T04:23:54.970Z";
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

export default function ReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const { user } = useAuth();

	const handleRespond = (id: string, response: string) => {
		setReviews(
			reviews.map((review) =>
				review.id === id ? { ...review, response } : review
			)
		);
	};

	const getReviews = async () => {
		if (!user) return;
		const {
			data: { reviews },
		} = await getUserReviews(user.id, 10, 1);
		setReviews(reviews);
	};

	useEffect(() => {
		getReviews();
	}, [user]);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
			{reviews.map((review) => (
				<Card key={review.id} className="mb-4">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<span>{review.reviewer.username}</span>
							<span className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-5 w-5 ${
											i < review.rating
												? "text-yellow-400 fill-current"
												: "text-gray-300"
										}`}
									/>
								))}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">{review.content}</p>
						{/* {review.response ? (
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="font-semibold">Your response:</p>
								<p>{review.response}</p>
							</div>
						) : (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const response = (
										e.target as HTMLFormElement
									).response.value;
									handleRespond(review.id, response);
								}}
								className="flex gap-2">
								<Input
									name="response"
									placeholder="Type your response..."
								/>
								<Button type="submit">Respond</Button>
							</form>
						)} */}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
