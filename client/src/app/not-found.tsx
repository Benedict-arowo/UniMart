"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, ArrowLeft, ShoppingBag, HelpCircle } from "lucide-react";

export default function NotFound() {
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// In a real app, you'd want to properly encode the search query
			router.push(`/?search=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
				{/* 404 Illustration */}
				<div className="mb-8 relative">
					<div className="text-[150px] font-bold text-primary/10">
						404
					</div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-primary">
						Oops!
					</div>
				</div>

				<h1 className="text-2xl font-bold mb-4">Page Not Found</h1>

				<p className="text-muted-foreground mb-8 max-w-md">
					The page you're looking for doesn't exist or has been moved.
					Don't worry though, you can find lots of other things on our
					homepage.
				</p>

				{/* Search Form */}
				<form onSubmit={handleSearch} className="w-full max-w-md mb-8">
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Search for products..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-1"
						/>
						<Button type="submit">
							<Search className="h-4 w-4" />
						</Button>
					</div>
				</form>

				{/* Quick Links */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
					<Button variant="outline" asChild className="w-full">
						<Link href="/">
							<Home className="mr-2 h-4 w-4" />
							Homepage
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full">
						<Link href="/category/all">
							<ShoppingBag className="mr-2 h-4 w-4" />
							All Products
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full">
						<Link href="/contact">
							<HelpCircle className="mr-2 h-4 w-4" />
							Contact Us
						</Link>
					</Button>
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="w-full">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Go Back
					</Button>
				</div>

				{/* Popular Categories */}
				<div className="text-center">
					<h2 className="text-lg font-semibold mb-4">
						Popular Categories
					</h2>
					<div className="flex flex-wrap justify-center gap-2">
						{[
							"Textbooks",
							"Electronics",
							"Stationery",
							"Dorm Essentials",
							"Clothing",
							"Food & Snacks",
						].map((category) => (
							<Link
								key={category}
								href={`/category/${category
									.toLowerCase()
									.replace(/ & /g, "-")}`}
								className="text-sm text-primary hover:underline">
								{category}
								{/* Add dot separator except for last item */}
								<span className="mx-2 text-muted-foreground last:hidden">
									•
								</span>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
