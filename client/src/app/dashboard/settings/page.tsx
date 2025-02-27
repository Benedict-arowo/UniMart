"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/FileUploader";
import Image from "next/image";

interface StoreSettings {
	name: string;
	description: string;
	email: string;
	phone: string;
	address: string;
	isPublished: boolean;
	logo: string;
	banner: string;
	theme: string;
	isBoosted: boolean;
}

const initialSettings: StoreSettings = {
	name: "My Awesome Store",
	description: "We sell the best products at the best prices!",
	email: "contact@myawesomestore.com",
	phone: "123-456-7890",
	address: "123 Main St, Anytown, USA",
	isPublished: true,
	logo: "",
	banner: "",
	theme: "default",
	isBoosted: false,
};

export default function SettingsPage() {
	const [settings, setSettings] = useState<StoreSettings>(initialSettings);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setSettings((prev) => ({ ...prev, [name]: value }));
	};

	const handleTogglePublish = (checked: boolean) => {
		setSettings((prev) => ({ ...prev, isPublished: checked }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send the updated settings to your API
		console.log("Updated settings:", settings);
		alert("Settings updated successfully!");
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Store Settings</h1>
			<Card>
				<CardHeader>
					<CardTitle>Edit Store Information</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Label htmlFor="name">Store Name</Label>
							<Input
								id="name"
								name="name"
								value={settings.name}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="description">
								Store Description
							</Label>
							<Textarea
								id="description"
								name="description"
								value={settings.description}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="email">Contact Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={settings.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="phone">Contact Phone</Label>
							<Input
								id="phone"
								name="phone"
								value={settings.phone}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="address">Store Address</Label>
							<Input
								id="address"
								name="address"
								value={settings.address}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label htmlFor="logo">Store Logo</Label>
							<FileUploader
								id="logo"
								accept="image/*"
								onFileSelect={(file) =>
									setSettings((prev) => ({
										...prev,
										logo: URL.createObjectURL(file),
									}))
								}
							/>
							{settings.logo && (
								<Image
									src={settings.logo}
									alt="Store Logo"
									className="mt-2 h-20 w-20 object-contain"
								/>
							)}
						</div>
						<div>
							<Label htmlFor="banner">Store Banner</Label>
							<FileUploader
								id="banner"
								accept="image/*"
								onFileSelect={(file) =>
									setSettings((prev) => ({
										...prev,
										banner: URL.createObjectURL(file),
									}))
								}
							/>
							{settings.banner && (
								<Image
									src={settings.banner}
									alt="Store Banner"
									className="mt-2 h-40 w-full object-cover"
								/>
							)}
						</div>
						<div>
							<Label htmlFor="theme">Store Theme</Label>
							<Select
								value={settings.theme}
								onValueChange={(value) =>
									setSettings((prev) => ({
										...prev,
										theme: value,
									}))
								}>
								<SelectTrigger>
									<SelectValue placeholder="Select a theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">
										Default
									</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="light">Light</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="isPublished"
								checked={settings.isPublished}
								onCheckedChange={handleTogglePublish}
							/>
							<Label htmlFor="isPublished">Publish Store</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="isBoosted"
								checked={settings.isBoosted}
								onCheckedChange={(checked) =>
									setSettings((prev) => ({
										...prev,
										isBoosted: checked,
									}))
								}
							/>
							<Label htmlFor="isBoosted">Boost Store</Label>
						</div>
						<Button type="submit">Save Changes</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
