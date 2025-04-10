"use client";

import { useEffect, useState } from "react";
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
import { createStore } from "@/services/store";
import { useAuth } from "@/contexts/AuthContext";

export default function StoreSetupPage() {
	const [storeName, setStoreName] = useState("");
	const [storeDescription, setStoreDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const { user } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await createStore(storeName, storeDescription);
			router.push("/dashboard/store");
		} catch (err: any) {
			setError(err.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user && user.store) {
			router.replace("/dashboard/store");
		}
	}, [user]);

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

							{error && (
								<p className="text-red-600 text-center text-sm">
									{error}
								</p>
							)}
						</div>

						<Button
							className="w-full mt-6"
							type="submit"
							disabled={loading}>
							{loading ? "Creating..." : "Create Store"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
