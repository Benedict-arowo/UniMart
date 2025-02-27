"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function StoreSetupPage() {
	const [storeName, setStoreName] = useState("");
	const [storeDescription, setStoreDescription] = useState("");
	const [themeId, setThemeId] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send a request to your API to create the store
		console.log("Store setup attempt with:", {
			storeName,
			storeDescription,
			themeId,
		});
		// If store setup is successful, redirect to the store dashboard or homepage
		router.push("/dashboard");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[600px]">
				<CardHeader>
					<CardTitle>Set Up Your Store</CardTitle>
					<CardDescription>
						Customize your store to start selling.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="storeName">Store Name</Label>
								<Input
									id="storeName"
									placeholder="Enter your store name"
									value={storeName}
									onChange={(e) =>
										setStoreName(e.target.value)
									}
									required
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="storeDescription">
									Store Description
								</Label>
								<Textarea
									id="storeDescription"
									placeholder="Describe your store"
									value={storeDescription}
									onChange={(e) =>
										setStoreDescription(e.target.value)
									}
									required
								/>
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="theme">Choose a Theme</Label>
								<Select
									value={themeId}
									onValueChange={setThemeId}>
									<SelectTrigger>
										<SelectValue placeholder="Select a theme" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="theme1">
											Modern
										</SelectItem>
										<SelectItem value="theme2">
											Classic
										</SelectItem>
										<SelectItem value="theme3">
											Minimalist
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<Button className="w-full mt-6" type="submit">
							Create Store
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
