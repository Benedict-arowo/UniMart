"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/FileUploader";
import { MoreHorizontal, Plus, Trash, Edit, Store } from "lucide-react";
import Image from "next/image";

interface Product {
	id: number;
	name: string;
	price: number;
	discountedPrice?: number;
	stock: number;
	isBoosted: boolean;
	isAvailable: boolean;
	description: string;
	category: string;
	images: string[];
	videos: string[];
	inStore: boolean;
}

const initialProducts: Product[] = [
	{
		id: 1,
		name: "Product 1",
		price: 19.99,
		stock: 100,
		isBoosted: false,
		isAvailable: true,
		description: "",
		category: "Category 1",
		images: [],
		videos: [],
		inStore: true,
	},
	{
		id: 2,
		name: "Product 2",
		price: 29.99,
		discountedPrice: 24.99,
		stock: 50,
		isBoosted: true,
		isAvailable: true,
		description: "",
		category: "Category 2",
		images: [],
		videos: [],
		inStore: false,
	},
	{
		id: 3,
		name: "Product 3",
		price: 39.99,
		stock: 75,
		isBoosted: false,
		isAvailable: false,
		description: "",
		category: "Category 1",
		images: [],
		videos: [],
		inStore: true,
	},
];

interface EditProductModalProps {
	product: Product;
	onSave: (product: Product) => void;
	onClose: () => void;
}

const EditProductModal = ({
	product,
	onSave,
	onClose,
}: EditProductModalProps) => {
	const [editedProduct, setEditedProduct] = useState<Product>(product);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditedProduct((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		onSave(editedProduct);
		onClose();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Edit Product</DialogTitle>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						Name
					</Label>
					<Input
						id="name"
						name="name"
						value={editedProduct.name}
						onChange={handleChange}
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="price" className="text-right">
						Price
					</Label>
					<Input
						id="price"
						name="price"
						type="number"
						value={editedProduct.price}
						onChange={handleChange}
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="discountedPrice" className="text-right">
						Discounted Price
					</Label>
					<Input
						id="discountedPrice"
						name="discountedPrice"
						type="number"
						value={editedProduct.discountedPrice || ""}
						onChange={handleChange}
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="stock" className="text-right">
						Stock
					</Label>
					<Input
						id="stock"
						name="stock"
						type="number"
						value={editedProduct.stock}
						onChange={handleChange}
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="description" className="text-right">
						Description
					</Label>
					<Textarea
						id="description"
						name="description"
						value={editedProduct.description}
						onChange={handleChange}
						className="col-span-3"
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="category" className="text-right">
						Category
					</Label>
					<Select
						value={editedProduct.category}
						onValueChange={(value) =>
							setEditedProduct((prev) => ({
								...prev,
								category: value,
							}))
						}>
						<SelectTrigger className="col-span-3">
							<SelectValue placeholder="Select a category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Category 1">
								Category 1
							</SelectItem>
							<SelectItem value="Category 2">
								Category 2
							</SelectItem>
							<SelectItem value="Category 3">
								Category 3
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">Available</Label>
					<Switch
						checked={editedProduct.isAvailable}
						onCheckedChange={(checked) =>
							setEditedProduct((prev) => ({
								...prev,
								isAvailable: checked,
							}))
						}
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">Boosted</Label>
					<Switch
						checked={editedProduct.isBoosted}
						onCheckedChange={(checked) =>
							setEditedProduct((prev) => ({
								...prev,
								isBoosted: checked,
							}))
						}
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">In Store</Label>
					<Switch
						checked={editedProduct.inStore}
						onCheckedChange={(checked) =>
							setEditedProduct((prev) => ({
								...prev,
								inStore: checked,
							}))
						}
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">Images</Label>
					<div className="col-span-3">
						<FileUploader
							id="images"
							accept="image/*"
							onFileSelect={(file) =>
								setEditedProduct((prev) => ({
									...prev,
									images: [
										...prev.images,
										URL.createObjectURL(file),
									],
								}))
							}
						/>
						<div className="mt-2 flex flex-wrap gap-2">
							{editedProduct.images.map((image, index) => (
								<Image
									key={index}
									src={image}
									alt={`Product ${index + 1}`}
									className="h-20 w-20 object-cover"
								/>
							))}
						</div>
					</div>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">Videos</Label>
					<div className="col-span-3">
						<FileUploader
							id="videos"
							accept="video/*"
							onFileSelect={(file) =>
								setEditedProduct((prev) => ({
									...prev,
									videos: [
										...prev.videos,
										URL.createObjectURL(file),
									],
								}))
							}
						/>
						<div className="mt-2 flex flex-wrap gap-2">
							{editedProduct.videos.map((video, index) => (
								<video
									key={index}
									src={video}
									className="h-20 w-20 object-cover"
									controls
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button onClick={onClose} variant="outline">
					Cancel
				</Button>
				<Button onClick={handleSave}>Save Changes</Button>
			</div>
		</DialogContent>
	);
};

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	const handleEdit = (product: Product) => {
		setEditingProduct(product);
	};

	const handleSaveEdit = (updatedProduct: Product) => {
		setProducts(
			products.map((p) =>
				p.id === updatedProduct.id ? updatedProduct : p
			)
		);
		setEditingProduct(null);
	};

	const handleDelete = (id: number) => {
		setProducts(products.filter((product) => product.id !== id));
	};

	const handleBulkDelete = () => {
		setProducts(
			products.filter((product) => !selectedProducts.includes(product.id))
		);
		setSelectedProducts([]);
	};

	const toggleProductSelection = (id: number) => {
		setSelectedProducts((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((productId) => productId !== id)
				: [...prevSelected, id]
		);
	};

	const toggleInStore = (id: number) => {
		setProducts(
			products.map((product) =>
				product.id === id
					? { ...product, inStore: !product.inStore }
					: product
			)
		);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Products</h1>
				<div className="flex space-x-2">
					<Button
						onClick={handleBulkDelete}
						variant="destructive"
						disabled={selectedProducts.length === 0}>
						<Trash className="mr-2 h-4 w-4" /> Delete Selected
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" /> Add Product
					</Button>
				</div>
			</div>
			<div className="mb-4">
				<Input placeholder="Search products..." />
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">
							<Checkbox
								checked={
									selectedProducts.length === products.length
								}
								onCheckedChange={(checked) => {
									if (checked) {
										setSelectedProducts(
											products.map((p) => p.id)
										);
									} else {
										setSelectedProducts([]);
									}
								}}
							/>
						</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>In Store</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map((product) => (
						<TableRow key={product.id}>
							<TableCell>
								<Checkbox
									checked={selectedProducts.includes(
										product.id
									)}
									onCheckedChange={() =>
										toggleProductSelection(product.id)
									}
								/>
							</TableCell>
							<TableCell>{product.name}</TableCell>
							<TableCell>
								${product.price.toFixed(2)}
								{product.discountedPrice !== undefined && (
									<span className="ml-2 text-sm text-green-600">
										${product.discountedPrice.toFixed(2)}
									</span>
								)}
							</TableCell>
							<TableCell>{product.stock}</TableCell>
							<TableCell>
								{product.isAvailable ? (
									<span className="text-green-600">
										Available
									</span>
								) : (
									<span className="text-red-600">
										Unavailable
									</span>
								)}
								{product.isBoosted && (
									<span className="ml-2 text-blue-600">
										Boosted
									</span>
								)}
							</TableCell>
							<TableCell>{product.category}</TableCell>
							<TableCell>
								<Button
									variant={
										product.inStore ? "default" : "outline"
									}
									onClick={() => toggleInStore(product.id)}>
									<Store className="mr-2 h-4 w-4" />
									{product.inStore
										? "Remove from Store"
										: "Add to Store"}
								</Button>
							</TableCell>
							<TableCell className="text-right">
								<Dialog>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>
												Actions
											</DropdownMenuLabel>
											<DialogTrigger asChild>
												<DropdownMenuItem
													onClick={() =>
														handleEdit(product)
													}>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
											</DialogTrigger>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() =>
													handleDelete(product.id)
												}
												className="text-red-600">
												<Trash className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									{editingProduct && (
										<EditProductModal
											product={editingProduct}
											onSave={handleSaveEdit}
											onClose={() =>
												setEditingProduct(null)
											}
										/>
									)}
								</Dialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
