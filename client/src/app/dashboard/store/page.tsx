"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/FileUploader";
import Image from "next/image";

interface StoreSettings {
	name: string;
	description: string;
	banner: string;
	logo: string;
}

interface Product {
	id: number;
	name: string;
	price: number;
	image: string;
}

const initialStoreSettings: StoreSettings = {
	name: "My Awesome Store",
	description: "Welcome to my awesome store!",
	banner: "/images/banner-placeholder.svg",
	logo: "/images/placeholder.svg",
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
	const [products, _setProducts] = useState<Product[]>(initialProducts);

	const handleSettingsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setStoreSettings((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileUpload = (field: "banner" | "logo") => (file: File) => {
		setStoreSettings((prev) => ({
			...prev,
			[field]: URL.createObjectURL(file),
		}));
	};

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
					<div>
						<label
							htmlFor="logo"
							className="block text-sm font-medium text-gray-700">
							Logo
						</label>
						<FileUploader
							id="logo"
							accept="image/*"
							onFileSelect={handleFileUpload("logo")}
						/>
						{storeSettings.logo && (
							<Image
								src={storeSettings.logo}
								alt="Store Logo"
								height={80}
								width={80}
								className="mt-2 h-20 w-20 object-contain"
							/>
						)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Store Preview</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="border rounded-lg p-4 space-y-4">
						<header className="flex items-center justify-between">
							<Image
								src={storeSettings.logo}
								alt="Store Logo"
								height={48}
								width={48}
								className="h-12 w-12 object-contain"
							/>
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
									<p>${product.price.toFixed(2)}</p>
								</div>
							))}
						</div>
						<footer className="text-center text-sm text-gray-500">
							© 2023 {storeSettings.name}. All rights reserved.
						</footer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
