"use client";

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
import { getUserProducts } from "@/services/user";
import {
	deleteProduct,
	deleteProductImage,
	updateProduct,
} from "@/services/product";
import { getCategories } from "@/services/category";
import { debounce } from "lodash";
import { Badge } from "@/components/ui/badge";

interface EditProductModalProps {
	product: EditedProduct;
	onSave: (product: any) => void;
	onRemoveImage: (id: string) => void;
	onClose: () => void;
}

const EditProductModal = ({
	product,
	onSave,
	onRemoveImage,
	onClose,
}: EditProductModalProps) => {
	const [editedProduct, setEditedProduct] = useState<EditedProduct>(product);
	const [newCategory, setNewCategory] = useState("");
	const [categories, setCategories] = useState([
		"Category 1",
		"Category 2",
		"Category 3",
	]);

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
				categories: [...prev.categories, newCategory],
			}));
			setNewCategory("");
		}
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
							{editedProduct.categories.map((category) => (
								<Badge
									key={category}
									className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded">
									{category}
									<button
										onClick={() =>
											setEditedProduct((prev) => ({
												...prev,
												categories:
													prev.categories.filter(
														(cat) =>
															cat !== category
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
					{/* {editedProduct.categories.map((category) => (
						<Badge
							key={category}
							text={category}
							onRemove={() =>
								setEditedProduct((prev) => ({
									...prev,
									categories: prev.categories.filter(
										(cat) => cat !== category
									),
								}))
							}
						/>
					))} */}

					{/* <Select
						value={editedProduct.categories}
						onValueChange={(value) =>
							setEditedProduct((prev) => ({
								...prev,
								categories: value,
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
					</Select> */}
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
							{editedProduct.media.map((image, index) => (
								<div key={index} className="relative h-20 w-20">
									<Image
										src={image.url}
										alt={`Product ${index + 1}`}
										width={80}
										height={80}
										className="h-20 w-20 object-cover rounded"
										unoptimized
									/>
									<button
										onClick={() =>
											handleRemoveImage(image.id)
										}
										className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-700">
										✕
									</button>
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
				<Button onClick={handleSave}>Save Changes</Button>
			</div>
		</DialogContent>
	);
};

// const CreateProductModal = ({
// 	onSave,
// 	onClose,
// }: {
// 	onSave: () => void;
// 	onClose: () => void;
// }) => {
// 	const [product, setProduct] = useState({
// 		name: "",
// 		price: 0,
// 		discountedPrice: 0,
// 		quantity: 0,
// 		description: "",
// 		media: [],
// 		isActive: true,
// 	});

// 	const handleChange = (
// 		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
// 	) => {
// 		const { name, value } = e.target;
// 		setProduct((prev) => ({ ...prev, [name]: value }));
// 	};

// 	const handleSave = async () => {
// 		onSave(product);
// 		onClose();
// 	};

// 	return (
// 		<DialogContent>
// 			<DialogHeader>
// 				<DialogTitle>Create Product</DialogTitle>
// 			</DialogHeader>
// 			<div className="grid gap-4 py-4">
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label htmlFor="name" className="text-right">
// 						Name
// 					</Label>
// 					<Input
// 						id="name"
// 						name="name"
// 						value={product.name}
// 						onChange={handleChange}
// 						className="col-span-3"
// 					/>
// 				</div>
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label htmlFor="price" className="text-right">
// 						Price
// 					</Label>
// 					<Input
// 						id="price"
// 						name="price"
// 						type="number"
// 						value={product.price}
// 						onChange={handleChange}
// 						className="col-span-3"
// 					/>
// 				</div>
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label htmlFor="discountedPrice" className="text-right">
// 						Discounted Price
// 					</Label>
// 					<Input
// 						id="discountedPrice"
// 						name="discountedPrice"
// 						type="number"
// 						value={product.discountedPrice || ""}
// 						onChange={handleChange}
// 						className="col-span-3"
// 					/>
// 				</div>
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label htmlFor="stock" className="text-right">
// 						Stock
// 					</Label>
// 					<Input
// 						id="stock"
// 						name="quantity"
// 						type="number"
// 						value={product.quantity}
// 						onChange={handleChange}
// 						className="col-span-3"
// 					/>
// 				</div>
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label htmlFor="description" className="text-right">
// 						Description
// 					</Label>
// 					<Textarea
// 						id="description"
// 						name="description"
// 						value={product.description}
// 						onChange={handleChange}
// 						className="col-span-3"
// 					/>
// 				</div>
// 				{/* <div className="grid grid-cols-4 items-center gap-4">
// 					<Label htmlFor="category" className="text-right">
// 						Category
// 					</Label>
// 					<Select
// 						value={product.category[0]}
// 						onValueChange={(value) =>
// 							setEditedProduct((prev) => ({
// 								...prev,
// 								categories: value,
// 							}))
// 						}>
// 						<SelectTrigger className="col-span-3">
// 							<SelectValue placeholder="Select a category" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							<SelectItem value="Category 1">
// 								Category 1
// 							</SelectItem>
// 							<SelectItem value="Category 2">
// 								Category 2
// 							</SelectItem>
// 							<SelectItem value="Category 3">
// 								Category 3
// 							</SelectItem>
// 						</SelectContent>
// 					</Select>
// 				</div> */}
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label className="text-right">Available</Label>
// 					<Switch
// 						checked={product.isActive}
// 						onCheckedChange={(checked) =>
// 							setProduct((prev) => ({
// 								...prev,
// 								isActive: checked,
// 							}))
// 						}
// 					/>
// 				</div>
// 				<div className="grid grid-cols-4 items-center gap-4">
// 					<Label className="text-right">Images</Label>
// 					<div className="col-span-3">
// 						<FileUploader
// 							id="images"
// 							accept="image/*"
// 							onFileSelect={(file) =>
// 								setProduct((prev) => ({
// 									...prev,
// 									media: [
// 										...prev.media,
// 										// URL.createObjectURL(file),
// 									],
// 								}))
// 							}
// 						/>
// 						<div className="mt-2 flex flex-wrap gap-2">
// 							{product.media.map((image, index) => (
// 								<Image
// 									key={index}
// 									src={image.url}
// 									alt={`Product ${index + 1}`}
// 									width={80}
// 									unoptimized
// 									height={80}
// 									className="h-20 w-20 object-cover"
// 								/>
// 							))}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="flex justify-end gap-2">
// 				<Button onClick={onClose} variant="outline">
// 					Cancel
// 				</Button>
// 				<Button onClick={handleSave}>Save Changes</Button>
// 			</div>
// 		</DialogContent>
// 	);
// };

export default function ProductsPage() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [editingProduct, setEditingProduct] = useState<EditedProduct | null>(
		null
	);
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	// const [showCreateProductModal, setShowCreateProductModal] = useState(true);
	const [categories, setCategories] = useState([]);

	const filteredProducts = useMemo(() => {
		const normalizedSearch = search.toLowerCase().trim();
		if (!normalizedSearch) return products;

		return products.filter(
			(prod) =>
				prod.name.toLowerCase().includes(normalizedSearch) ||
				prod.description.toLowerCase().includes(normalizedSearch)
		);
	}, [debouncedSearch, products]);

	const handleEdit = (product: EditedProduct) => {
		setEditingProduct({
			...product,
			categories: product.category.map((category) => {
				return category.name;
			}),
		});
	};

	const handleRemoveImage = async (imageId: string) => {
		// await deleteProductImage(imageId);
		setProducts((prev) => {
			const product = prev.find((p) =>
				p.media.find((img) => img.id === imageId)
			);

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

	// const handleSearch = () => {
	// 	const newProducts = products.filter(
	// 		(prod) =>
	// 			prod.name.toLowerCase().includes(search.toLowerCase().trim()) ||
	// 			prod.description
	// 				.toLowerCase()
	// 				.includes(search.toLowerCase().trim())
	// 	);

	// 	setFilteredProducts(() => newProducts);
	// };

	const handleSearch = debounce((term: string) => {
		setDebouncedSearch(term);
	}, 800);

	const handleSaveEdit = async (updatedProduct: EditedProduct) => {
		const response = await updateProduct(updatedProduct.id, {
			name: updatedProduct.name,
			description: updatedProduct.description,
			price: updatedProduct.price,
			// categories: updatedProduct.categories,
			media: updatedProduct.media,
			quantity: updatedProduct.quantity,
			discountedPrice: isNaN(Number(updatedProduct.discountedPrice))
				? null
				: Number(updatedProduct.discountedPrice),
			isActive: updatedProduct.isActive,
		});
		if (!response.success) throw new Error("Failed to update product.");
		console.log(response.data.product);
		setProducts((prev) =>
			prev.map((p) =>
				p.id === updatedProduct.id ? response.data.product : p
			)
		);
		setEditingProduct(null);
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

	// const toggleInStore = (id: string) => {
	// 	setProducts(
	// 		products.map((product) =>
	// 			product.id === id
	// 				? { ...product, inStore: !product.store }
	// 				: product
	// 		)
	// 	);
	// };

	const fetchCategories = async () => {
		try {
			const response = await getCategories(50, 1);
			if (!response.success) throw new Error("Failed to get categories.");

			setCategories(() => response.data.categories);
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const fetchProducts = async ({
		page = 1,
		limit = 10,
		featured,
	}: {
		page: number;
		limit: number;
		featured: boolean | undefined;
	}) => {
		try {
			const response = await getUserProducts(limit, page, undefined);
			if (!response.success) throw new Error("Failed to get products.");

			return response.data.products;
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	useEffect(() => {
		(async () => {
			const products = await fetchProducts({
				page: 1,
				limit: 10,
				featured: undefined,
			});

			setProducts(() => products);
			// setFilteredProducts(() => products);
		})();
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
					<Button>
						<Plus onClick={() => {}} className="mr-2 h-4 w-4" /> Add
						Product
					</Button>
				</div>
			</div>
			<div className="mb-4">
				<Input
					placeholder="Search products..."
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
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
						{/* <TableHead>In Store</TableHead> */}
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredProducts.map((product) => (
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
								{product.category.map((cate) => cate.name)}
							</TableCell>
							{/* <TableCell>
								<Button
									variant={
										product.store ? "default" : "outline"
									}
									onClick={() => toggleInStore(product.id)}>
									<Store className="mr-2 h-4 w-4" />
									{product.store
										? "Remove from Store"
										: "Add to Store"}
								</Button>
							</TableCell> */}
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
														handleEdit({
															...product,
															categories:
																product.category.map(
																	(i) =>
																		i.name
																),
														})
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
											onRemoveImage={handleRemoveImage}
											onClose={() =>
												setEditingProduct(null)
											}
										/>
									)}

									{/* <CreateProductModal
										onClose={() =>
											setShowCreateProductModal(
												() => false
											)
										}
										onSave={() => {}}
									/> */}
									{/* {showCreateProductModal && (
									
									)} */}
								</Dialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
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
	discountedPrice: number;
	reviews: [];
	reports: [];
	likes: [];
	price: number;
	payments: [];
	store?: {
		id: string;
		name: string;
		description: "";
		customUrl: null;
		isActive: true;
		isBoosted: true;
		boostedAt: null;
		boostExpiresAt: null;
		ownerId: string;
	};
	media: {
		id: string;
		url: string;
		type: "IMAGE";
		public_id: any;
		productId: string;
		createdAt: Date;
	}[];
	category: { name: string }[];
}

interface EditedProduct extends IProduct {
	categories: string[];
}
