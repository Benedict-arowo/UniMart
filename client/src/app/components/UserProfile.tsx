import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/contexts/AuthContext";
import { format } from "timeago.js";
import Link from "next/link";

// export function UserProfile({ user }: { user: User }) {
// 	return (
// 		<Card className="w-full max-w-3xl mx-auto">
// 			<CardHeader>
// 				<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
// 					<Avatar className="h-24 w-24">
// 						<AvatarImage
// 							src={"/placeholder.svg"}
// 							alt={user.username}
// 						/>
// 						<AvatarFallback>
// 							{user.username.charAt(0)}
// 						</AvatarFallback>
// 					</Avatar>
// 					<div className="text-center sm:text-left">
// 						<div className="flex items-center justify-center sm:justify-start space-x-2">
// 							<CardTitle className="text-2xl">
// 								{user.username}
// 							</CardTitle>
// 							{user.verified && (
// 								<Badge
// 									variant="default"
// 									className="bg-blue-500 text-white">
// 									Verified
// 								</Badge>
// 							)}
// 						</div>
// 						<Badge
// 							variant={
// 								user.roles.includes("seller")
// 									? "default"
// 									: "secondary"
// 							}
// 							className="mt-2">
// 							{user.roles.join(", ")}
// 						</Badge>
// 						{/* {user.rating && (
// 							<div className="flex items-center justify-center sm:justify-start mt-2">
// 								<Star className="text-yellow-400 mr-1" />
// 								<span>{user.rating.toFixed(1)} / 5.0</span>
// 							</div>
// 						)} */}
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardContent>
// 				{/* {user.location && (
// 					<div className="flex items-center mb-4">
// 						<MapPin className="mr-2" />
// 						<span>{user.location}</span>
// 					</div>
// 				)} */}
// 				{/* {user.interests && (
// 					<div className="mb-4">
// 						<h3 className="font-semibold mb-2 flex items-center">
// 							<Book className="mr-2" /> Interests
// 						</h3>
// 						<div className="flex flex-wrap gap-2">
// 							{user.interests.map((interest) => (
// 								<Badge key={interest} variant="outline">
// 									{interest}
// 								</Badge>
// 							))}
// 						</div>
// 					</div>
// 				)} */}
// 				{/* {user.role === "seller" && user.catalog && (
// 					<div>
// 						<h3 className="font-semibold mb-4">
// 							Catalog ({user.productsCount} items)
// 						</h3>
// 						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// 							{user.catalog.slice(0, 6).map((product) => (
// 								<ProductCard
// 									key={product.id}
// 									product={product}
// 								/>
// 							))}
// 						</div>
// 					</div>
// 				)} */}
// 			</CardContent>
// 		</Card>
// 	);
// }

export function UserProfile({ user }: { user: User }) {
	return (
		<Card className="w-full max-w-full mx-auto p-6 shadow-lg rounded-lg border border-gray-200">
			<CardHeader className="flex flex-col sm:flex-row items-center sm:justify-between sm:items-center space-y-6 sm:space-y-0">
				{/* Left: Avatar & Basic Info */}
				<div className="flex items-center space-x-6">
					<Avatar className="h-24 w-24 border-2 border-gray-300">
						<AvatarImage
							src="/placeholder.svg"
							alt={user.username}
						/>
						<AvatarFallback className="text-2xl font-semibold">
							{user.username.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle className="text-2xl font-semibold">
							{user.username}
						</CardTitle>
						{user.verified && (
							<Badge className="bg-blue-500 text-white px-3 py-1 mt-1">
								Verified
							</Badge>
						)}
						<p className="text-gray-600 text-sm">
							Email: {user.email}
						</p>
						<p className="text-gray-600 text-sm">
							Joined: {new Date(user.createdAt).toDateString()}
						</p>
					</div>
				</div>

				{/* Right: User Status & Roles */}
				<div className="flex flex-col items-end space-y-3">
					<div className="flex items-center space-x-2">
						<span className="text-gray-700 text-sm">Status:</span>
						{user.isOnline ? (
							<Badge className="bg-green-500 text-white">
								Online
							</Badge>
						) : (
							<Badge className="bg-gray-500 text-white">
								{user.isOnline ? "Online" : "Offline"}
							</Badge>
						)}
					</div>
					<div className="flex flex-wrap gap-2 justify-end">
						{user.roles.map((role) => (
							<Badge
								key={role}
								className="bg-gray-800 text-white px-3 py-1">
								{role}
							</Badge>
						))}
					</div>
				</div>
			</CardHeader>

			<CardContent className="mt-6 text-gray-700">
				{/* Store Information (if available) */}
				{user.store ? (
					<div className="border-t pt-4 flex justify-between items-center">
						<div>
							<h3 className="text-lg font-semibold">
								Store:{" "}
								<Link
									href={`/store/${
										user.store.customUrl
											? user.store.customUrl
											: user.store.id
									}`}>
									{user.store.name}
								</Link>
							</h3>
							<p className="text-sm text-gray-600">
								{user.store.description ||
									"No description available"}
							</p>
						</div>
						<div className="flex items-center space-x-3">
							{user.store.customUrl && (
								<a
									href={user.store.customUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 text-sm hover:underline">
									Visit Store
								</a>
							)}
							{user.store.isActive ? (
								<Badge className="bg-green-500 text-white">
									Active
								</Badge>
							) : (
								<Badge className="bg-red-500 text-white">
									Inactive
								</Badge>
							)}
						</div>
					</div>
				) : (
					<p className="text-center text-sm text-gray-500">
						No store linked to this profile.
					</p>
				)}
			</CardContent>
		</Card>
	);
}
