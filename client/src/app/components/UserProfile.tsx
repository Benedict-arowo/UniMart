import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Book } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface UserProfileProps {
	user: {
		name: string;
		avatar: string;
		role: "buyer" | "seller";
		rating?: number;
		interests?: string[];
		location?: string;
		productsCount?: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		catalog?: any[];
		verified?: boolean;
	};
}

export function UserProfile({ user }: UserProfileProps) {
	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
					<Avatar className="h-24 w-24">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="text-center sm:text-left">
						<div className="flex items-center justify-center sm:justify-start space-x-2">
							<CardTitle className="text-2xl">
								{user.name}
							</CardTitle>
							{user.verified && (
								<Badge
									variant="default"
									className="bg-blue-500 text-white">
									Verified
								</Badge>
							)}
						</div>
						<Badge
							variant={
								user.role === "seller" ? "default" : "secondary"
							}
							className="mt-2">
							{user.role === "seller" ? "Seller" : "Buyer"}
						</Badge>
						{user.rating && (
							<div className="flex items-center justify-center sm:justify-start mt-2">
								<Star className="text-yellow-400 mr-1" />
								<span>{user.rating.toFixed(1)} / 5.0</span>
							</div>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{user.location && (
					<div className="flex items-center mb-4">
						<MapPin className="mr-2" />
						<span>{user.location}</span>
					</div>
				)}
				{user.interests && (
					<div className="mb-4">
						<h3 className="font-semibold mb-2 flex items-center">
							<Book className="mr-2" /> Interests
						</h3>
						<div className="flex flex-wrap gap-2">
							{user.interests.map((interest) => (
								<Badge key={interest} variant="outline">
									{interest}
								</Badge>
							))}
						</div>
					</div>
				)}
				{user.role === "seller" && user.catalog && (
					<div>
						<h3 className="font-semibold mb-4">
							Catalog ({user.productsCount} items)
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							{user.catalog.slice(0, 6).map((product) => (
								<ProductCard
									key={product.id}
									product={product}
								/>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
