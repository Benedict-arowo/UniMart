"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { updateStore } from "@/services/store";
import { Skeleton } from "@/components/ui/skeleton";

interface StoreSettings {
	name: string;
	description: string;
	banner: string;
	bannerFile?: File;
	logo?: string;
}

interface Product {
	id: number;
	name: string;
	price: number;
	image: string;
}

const initialStoreSettings: StoreSettings = {
	name: "",
	description: "",
	banner: "/images/banner-placeholder.svg",
};

const initialProducts: Product[] = [
	{
		id: 1,
		name: "Product 1",
		price: 19.99,
		image: "/images/placeholder.svg",
	},
	{
		id: 2,
		name: "Product 2",
		price: 29.99,
		image: "/images/placeholder.svg",
	},
	{
		id: 3,
		name: "Product 3",
		price: 39.99,
		image: "/images/placeholder.svg",
	},
];

export default function StorePage() {
	const [storeSettings, setStoreSettings] =
		useState<StoreSettings>(initialStoreSettings);
	const [originalSettings, setOriginalSettings] =
		useState<StoreSettings>(initialStoreSettings);
	const [products] = useState<Product[]>(initialProducts);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { user } = useAuth();
	const { toast } = useToast();

	useEffect(() => {
		if (user && user.store) {
			const settingsFromUser = {
				name: user.store.name,
				description: user.store.description,
				banner:
					user.store.banner.url || "/images/banner-placeholder.svg",
			};
			setStoreSettings(settingsFromUser);
			setOriginalSettings(settingsFromUser);
			setIsLoading(false);
		}
	}, [user]);

	const hasChanges =
		storeSettings.name !== originalSettings.name ||
		storeSettings.description !== originalSettings.description ||
		storeSettings.banner !== originalSettings.banner;

	const handleSettingsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setStoreSettings((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileUpload = (field: "banner") => (file: File) => {
		setStoreSettings((prev) => ({
			...prev,
			[field]: URL.createObjectURL(file),
			bannerFile: file,
		}));
	};

	const saveStoreSettings = async () => {
		setIsSaving(true);
		try {
			await updateStore(
				user.store.id,
				storeSettings.name,
				storeSettings.description,
				storeSettings.bannerFile instanceof File
					? storeSettings.bannerFile
					: undefined
			);
			setOriginalSettings(storeSettings);
			toast({
				title: "Success",
				description: "Store settings updated successfully!",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "Failed to update store settings.",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<h1 className="text-3xl font-bold">Store Preview</h1>
				<Card>
					<CardHeader>
						<CardTitle>Loading Store Settings...</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-24 w-full" />
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-10 w-full" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Loading Store Preview...</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<Skeleton className="h-12 w-12 rounded-full" />
							<Skeleton className="h-10 w-1/3" />
						</div>
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-16 w-full" />
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-40 w-full" />
									<Skeleton className="h-6 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Store Preview</h1>

			<Card>
				<CardHeader>
					<CardTitle>Store Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700">
							Store Name
						</label>
						<Input
							id="name"
							name="name"
							value={storeSettings.name}
							onChange={handleSettingsChange}
						/>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700">
							Store Description
						</label>
						<Textarea
							id="description"
							name="description"
							value={storeSettings.description}
							onChange={handleSettingsChange}
						/>
					</div>
					<div>
						<label
							htmlFor="banner"
							className="block text-sm font-medium text-gray-700">
							Banner Image
						</label>
						<FileUploader
							id="banner"
							accept="image/*"
							onFileSelect={handleFileUpload("banner")}
						/>
						{storeSettings.banner && (
							<Image
								src={storeSettings.banner}
								alt="Store Banner"
								height={160}
								width={100}
								className="mt-2 h-40 w-full object-cover"
							/>
						)}
					</div>
					{hasChanges && (
						<div className="relative">
							<div className="transition-opacity duration-300 ease-in-out opacity-100 transform translate-y-0">
								<Button
									onClick={saveStoreSettings}
									disabled={isSaving}
									className="w-full">
									{isSaving ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Store Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="border rounded-lg p-4 space-y-4">
						<header className="flex items-center justify-between">
							<h2 className="text-2xl font-bold">
								{storeSettings.name}
							</h2>
						</header>
						<Image
							src={storeSettings.banner}
							alt="Store Banner"
							width={100}
							height={160}
							className="w-full h-40 object-cover"
						/>
						<p>{storeSettings.description}</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{products.map((product) => (
								<div
									key={product.id}
									className="border rounded-lg p-4">
									<Image
										src={product.image}
										alt={product.name}
										height={160}
										width={100}
										className="w-full h-40 object-cover mb-2"
									/>
									<h3 className="font-semibold">
										{product.name}
									</h3>
									<p>₦{product.price.toFixed(2)}</p>
								</div>
							))}
						</div>
						<footer className="text-center text-sm text-gray-500">
							© 2024 {storeSettings.name}. All rights reserved.
						</footer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
