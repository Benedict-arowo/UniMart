"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
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
	DialogPortal,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/FileUploader";
import { MoreHorizontal, Plus, Trash, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { getUserProducts } from "@/services/user";
import {
	deleteProduct,
	updateProduct,
	createProduct,
} from "@/services/product";
import { Badge } from "@/components/ui/badge";

interface EditProductModalProps {
	product?: IProduct; // Made optional to support creation
	isNew?: boolean;
	onSave: (product: IProduct) => void;
	onRemoveImage: (id: string) => void;
	onClose: () => void;
}

const EditProductModal = ({
	product,
	isNew = false,
	onSave,
	onRemoveImage,
	onClose,
}: EditProductModalProps) => {
	// Create a default empty product for new products
	const defaultNewProduct: IProduct = {
		id: "",
		name: "",
		quantity: 0,
		isActive: true,
		isBoosted: false,
		boostedAt: new Date(),
		boostExpiresAt: new Date(),
		description: "",
		discountedPrice: null,
		reviews: [],
		reports: [],
		likes: [],
		price: 0,
		payments: [],
		media: [],
		category: [],
	};

	const [editedProduct, setEditedProduct] = useState<IProduct>(
		product || defaultNewProduct
	);
	const [newCategory, setNewCategory] = useState("");
	const [categories, setCategories] = useState([]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setEditedProduct((prev) => ({ ...prev, [name]: value }));
	};

	const handleRemoveImage = (id: string) => {
		setEditedProduct((prod) => {
			return {
				...prod,
				media: [...prod.media.filter((img) => img.id !== id)],
			};
		});
		onRemoveImage(id);
	};

	const handleSave = async () => {
		onSave(editedProduct);
		onClose();
	};

	const handleAddCategory = () => {
		if (newCategory.trim() && !categories.includes(newCategory)) {
			setCategories((prev) => [...prev, newCategory]);
			setEditedProduct((prev) => ({
				...prev,
				category: [
					...prev.category,
					{ id: new Date().toTimeString(), name: newCategory },
				],
			}));
			setNewCategory("");
		}
	};

	return (
		<DialogContent
			onCloseAutoFocus={() => {
				onClose();
			}}>
			<DialogHeader>
				<DialogTitle>
					{isNew ? "Add Product" : "Edit Product"}
				</DialogTitle>
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
						name="quantity"
						type="number"
						value={editedProduct.quantity}
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

					<div className="flex flex-col gap-1 col-span-3">
						<div className="flex flex-wrap gap-2">
							{editedProduct.category.map((category) => (
								<Badge
									key={category.name}
									className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded">
									{category.name}
									<button
										onClick={() =>
											setEditedProduct((prev) => ({
												...prev,
												category: prev.category.filter(
													(cat) =>
														cat.name !==
														category.name
												),
											}))
										}
										className="text-xs ml-2 text-white hover:text-red-500">
										✕
									</button>
								</Badge>
							))}
						</div>
						<div className="flex items-center w-full gap-2">
							<Input
								value={newCategory}
								className="w-full"
								onChange={(e) => setNewCategory(e.target.value)}
								placeholder="Add a new category"
							/>
							<Button
								onClick={handleAddCategory}
								variant="outline">
								Add
							</Button>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label className="text-right">Available</Label>
					<Switch
						checked={editedProduct.isActive}
						onCheckedChange={(checked) =>
							setEditedProduct((prev) => ({
								...prev,
								isActive: checked,
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
							onFileSelect={(file) => {
								setEditedProduct((prev) => ({
									...prev,
									media: [
										...prev.media,
										{
											id: new Date()
												.getMilliseconds()
												.toString(),
											url: URL.createObjectURL(file),
											createdAt: new Date(),
											productId: prev.id,
											public_id: file,
											type: "IMAGE",
										},
									],
								}));
							}}
						/>
						<div className="mt-2 flex flex-wrap gap-2">
							{editedProduct.media &&
								editedProduct.media.map((image, index) => (
									<div
										key={index}
										className="relative h-20 w-20">
										<Image
											src={
												image.url ||
												"/placeholder.svg?height=80&width=80"
											}
											alt={`Product ${index + 1}`}
											width={80}
											height={80}
											className="h-20 w-20 object-cover rounded"
											unoptimized
										/>
										<Trash2
											onClick={() =>
												handleRemoveImage(image.id)
											}
											className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-700"
										/>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button onClick={onClose} variant="outline">
					Cancel
				</Button>
				<Button onClick={handleSave}>
					{isNew ? "Add Product" : "Save Changes"}
				</Button>
			</div>
		</DialogContent>
	);
};

export default function ProductsPage() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	const filteredProducts = useMemo(() => {
		const normalizedSearch = search.toLowerCase().trim();
		if (!normalizedSearch) return products;

		return products.filter(
			(prod) =>
				prod.name.toLowerCase().includes(normalizedSearch) ||
				prod.description.toLowerCase().includes(normalizedSearch)
		);
	}, [debouncedSearch, products]);

	const handleEdit = (product?: IProduct) => {
		setEditingProduct(product || null);
		setIsDialogOpen(true);
	};

	// Add a function to create a new product
	const handleCreateProduct = async (newProduct: IProduct) => {
		try {
			// Assuming you have a createProduct function in your services
			const response = await createProduct({
				name: newProduct.name,
				description: newProduct.description,
				price: newProduct.price,
				categories: newProduct.category.map((item) => item.name),
				media: newProduct.media,
				quantity: newProduct.quantity,
				discountedPrice: isNaN(Number(newProduct.discountedPrice))
					? null
					: Number(newProduct.discountedPrice),
				isActive: newProduct.isActive,
			});

			if (!response.success) throw new Error("Failed to create product.");

			// Add the new product to the list
			setProducts((prev) => [...prev, response.data.product]);
			setEditingProduct(null);
		} catch (error) {
			console.error("Error creating product:", error);
			// You might want to show an error message to the user
		}
	};

	// Update the handleSaveEdit function to handle both editing and creating
	const handleSaveEdit = async (updatedProduct: IProduct) => {
		// If the product has no ID, it's a new product
		if (!updatedProduct.id) {
			await handleCreateProduct(updatedProduct);
			return;
		}

		// Otherwise, update the existing product
		const response = await updateProduct(updatedProduct.id, {
			name: updatedProduct.name,
			description: updatedProduct.description,
			price: updatedProduct.price,
			categories: updatedProduct.category.map((item) => item.name),
			media: updatedProduct.media,
			quantity: updatedProduct.quantity,
			discountedPrice: isNaN(Number(updatedProduct.discountedPrice))
				? undefined
				: Number(updatedProduct.discountedPrice),
			isActive: updatedProduct.isActive,
		});

		if (!response.success) throw new Error("Failed to update product.");

		setProducts((prev) =>
			prev.map((p) =>
				p.id === updatedProduct.id ? response.data.product : p
			)
		);
		setEditingProduct(null);
	};

	const handleRemoveImage = async (imageId: string) => {
		if (!editingProduct) return;

		// For new products that haven't been saved yet
		if (editingProduct && !editingProduct.id) {
			setEditingProduct((prev) => {
				if (!prev) return null;
				return {
					...prev,
					media: prev.media.filter((img) => img.id !== imageId),
				};
			});
			return;
		}

		// For existing products
		setProducts((prev) => {
			const product = prev.find((p) =>
				p.media.find((img) => img.id === imageId)
			);

			if (!product) return prev;

			return prev.map((prod) => {
				if (prod.id === product.id) {
					return {
						...product,
						media: [
							...product.media.filter(
								(img) => img.id !== imageId
							),
						],
					};
				} else return prod;
			});
		});
	};

	const handleSearch = (term: string) => {
		setSearch(term);
		// Simple debounce implementation
		setTimeout(() => {
			setDebouncedSearch(term);
		}, 300);
	};

	const handleDelete = async (id: string) => {
		await deleteProduct(id);
		setProducts(products.filter((product) => product.id !== id));
	};

	const handleBulkDelete = () => {
		selectedProducts.forEach(async (prodId) => {
			await handleDelete(prodId);
		});
		setSelectedProducts([]);
	};

	const toggleProductSelection = (id: string) => {
		setSelectedProducts((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((productId) => productId !== id)
				: [...prevSelected, id]
		);
	};

	useEffect(() => {
		const loadProducts = async () => {
			try {
				const response = await getUserProducts(10, 1, undefined);
				if (response.success) {
					setProducts(response.data.products);
				}
			} catch (error) {
				console.error("Error loading products:", error);
			}
		};

		loadProducts();
	}, []);

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
					<Button
						onClick={() => {
							handleEdit();
						}}>
						<Plus className="mr-2 h-4 w-4" /> Add Product
					</Button>
				</div>
			</div>
			<div className="mb-4">
				<Input
					placeholder="Search products..."
					value={search}
					onChange={(e) => {
						handleSearch(e.target.value);
					}}
				/>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">
							<Checkbox
								checked={
									selectedProducts.length ===
										products.length && products.length > 0
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
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredProducts.length > 0 ? (
						filteredProducts.map((product) => (
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
									{product.discountedPrice !== null && (
										<span className="ml-2 text-sm text-green-600">
											${product.discountedPrice}
										</span>
									)}
								</TableCell>
								<TableCell>{product.quantity}</TableCell>
								<TableCell>
									{product.isActive ? (
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
								<TableCell>
									{product.category
										.map((cate) => cate.name)
										.join(", ")}
								</TableCell>
								<TableCell className="text-right">
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
											<DropdownMenuItem
												onClick={() =>
													handleEdit(product)
												}>
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
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
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-4">
								No products found. Add a new product to get
								started.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				{isDialogOpen && (
					<DialogPortal>
						<EditProductModal
							product={editingProduct}
							isNew={!editingProduct}
							onSave={handleSaveEdit}
							onRemoveImage={handleRemoveImage}
							onClose={() => {
								setIsDialogOpen(false);
								setEditingProduct(null);
							}}
						/>
					</DialogPortal>
				)}
			</Dialog>
		</div>
	);
}

interface IProduct {
	id: string;
	name: string;
	quantity: number;
	isActive: boolean;
	isBoosted: boolean;
	boostedAt: Date;
	boostExpiresAt: Date;
	description: string;
	discountedPrice: number | null;
	reviews: any[];
	reports: any[];
	likes: any[];
	price: number;
	payments: any[];
	store?: {
		id: string;
		name: string;
		description: string;
		customUrl: string | null;
		isActive: boolean;
		isBoosted: boolean;
		boostedAt: Date | null;
		boostExpiresAt: Date | null;
		ownerId: string;
	};
	media: {
		id: string;
		url: string;
		type: string;
		public_id: string | File;
		productId: string;
		createdAt: Date;
	}[];
	category: {
		id: string;
		name: string;
	}[];
}
