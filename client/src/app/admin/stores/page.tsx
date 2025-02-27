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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Edit, Trash, Store, Lock, Unlock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface StoreData {
	id: number;
	name: string;
	description: string;
	owner: string;
	products: number;
	status: "active" | "inactive";
	isLocked: boolean;
}

interface User {
	id: number;
	name: string;
}

const initialStores: StoreData[] = [
	{
		id: 1,
		name: "Tech Haven",
		description: "Electronics and gadgets",
		owner: "John Doe",
		products: 150,
		status: "active",
		isLocked: false,
	},
	{
		id: 2,
		name: "Fashion Frenzy",
		description: "Latest fashion trends",
		owner: "Jane Smith",
		products: 300,
		status: "active",
		isLocked: false,
	},
	{
		id: 3,
		name: "Home Essentials",
		description: "Everything for your home",
		owner: "Bob Johnson",
		products: 75,
		status: "inactive",
		isLocked: true,
	},
];

const users: User[] = [
	{ id: 1, name: "John Doe" },
	{ id: 2, name: "Jane Smith" },
	{ id: 3, name: "Bob Johnson" },
	{ id: 4, name: "Alice Williams" },
];

export default function StoresPage() {
	const [stores, setStores] = useState<StoreData[]>(initialStores);
	const [editingStore, setEditingStore] = useState<StoreData | null>(null);
	const [_isAddingStore, setIsAddingStore] = useState(false);
	const [newStore, setNewStore] = useState<Partial<StoreData>>({});

	const handleStatusToggle = (id: number) => {
		setStores(
			stores.map((store) =>
				store.id === id && !store.isLocked
					? {
							...store,
							status:
								store.status === "active"
									? "inactive"
									: "active",
					  }
					: store
			)
		);
	};

	const handleDelete = (id: number) => {
		setStores(stores.filter((store) => store.id !== id));
	};

	const handleEdit = (store: StoreData) => {
		setEditingStore({ ...store });
	};

	const handleSave = () => {
		if (editingStore) {
			setStores(
				stores.map((store) =>
					store.id === editingStore.id ? editingStore : store
				)
			);
			setEditingStore(null);
		}
	};

	const handleAddStore = () => {
		if (newStore.name && newStore.owner) {
			const newStoreData: StoreData = {
				id: Math.max(...stores.map((s) => s.id)) + 1,
				name: newStore.name,
				description: newStore.description || "",
				owner: newStore.owner,
				products: 0,
				status: "inactive",
				isLocked: false,
			};
			setStores([...stores, newStoreData]);
			setNewStore({});
			setIsAddingStore(false);
		}
	};

	const handleLockToggle = (id: number) => {
		setStores(
			stores.map((store) =>
				store.id === id
					? { ...store, isLocked: !store.isLocked }
					: store
			)
		);
	};

	return (
		<Dialog>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Manage Stores</h1>
				<Button onClick={() => setIsAddingStore(true)}>
					<Store className="mr-2 h-4 w-4" /> Add Store
				</Button>
			</div>
			<div className="mb-4">
				<Input placeholder="Search stores..." />
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Store Name</TableHead>
						<TableHead>Owner</TableHead>
						<TableHead>Products</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Locked</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{stores.map((store) => (
						<TableRow key={store.id}>
							<TableCell>{store.name}</TableCell>
							<TableCell>{store.owner}</TableCell>
							<TableCell>{store.products}</TableCell>
							<TableCell>
								<Button
									variant={
										store.status === "active"
											? "default"
											: "secondary"
									}
									onClick={() => handleStatusToggle(store.id)}
									disabled={store.isLocked}>
									{store.status === "active"
										? "Active"
										: "Inactive"}
								</Button>
							</TableCell>
							<TableCell>
								<Button
									variant="ghost"
									onClick={() => handleLockToggle(store.id)}>
									{store.isLocked ? (
										<Lock className="h-4 w-4" />
									) : (
										<Unlock className="h-4 w-4" />
									)}
								</Button>
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
										<DialogTrigger asChild>
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault();
													handleEdit(store);
												}}>
												<Edit className="mr-2 h-4 w-4" />{" "}
												Edit
											</DropdownMenuItem>
										</DialogTrigger>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onSelect={() =>
												handleDelete(store.id)
											}
											className="text-red-600">
											<Trash className="mr-2 h-4 w-4" />{" "}
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{editingStore ? "Edit Store" : "Add Store"}
					</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Store Name
						</Label>
						<Input
							id="name"
							value={
								editingStore
									? editingStore.name
									: newStore.name || ""
							}
							onChange={(e) =>
								editingStore
									? setEditingStore({
											...editingStore,
											name: e.target.value,
									  })
									: setNewStore({
											...newStore,
											name: e.target.value,
									  })
							}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="description" className="text-right">
							Description
						</Label>
						<Textarea
							id="description"
							value={
								editingStore
									? editingStore.description
									: newStore.description || ""
							}
							onChange={(e) =>
								editingStore
									? setEditingStore({
											...editingStore,
											description: e.target.value,
									  })
									: setNewStore({
											...newStore,
											description: e.target.value,
									  })
							}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="owner" className="text-right">
							Owner
						</Label>
						<Select
							value={
								editingStore
									? editingStore.owner
									: newStore.owner
							}
							onValueChange={(value) =>
								editingStore
									? setEditingStore({
											...editingStore,
											owner: value,
									  })
									: setNewStore({ ...newStore, owner: value })
							}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select an owner" />
							</SelectTrigger>
							<SelectContent>
								{users.map((user) => (
									<SelectItem key={user.id} value={user.name}>
										{user.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{editingStore && (
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="status" className="text-right">
								Status
							</Label>
							<Select
								value={editingStore.status}
								onValueChange={(value: "active" | "inactive") =>
									setEditingStore({
										...editingStore,
										status: value,
									})
								}
								disabled={editingStore.isLocked}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select a status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">
										Active
									</SelectItem>
									<SelectItem value="inactive">
										Inactive
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
					{editingStore && (
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="locked" className="text-right">
								Locked
							</Label>
							<Switch
								id="locked"
								checked={editingStore.isLocked}
								onCheckedChange={(checked) =>
									setEditingStore({
										...editingStore,
										isLocked: checked,
									})
								}
								className="col-span-3"
							/>
						</div>
					)}
				</div>
				<Button onClick={editingStore ? handleSave : handleAddStore}>
					{editingStore ? "Save changes" : "Add Store"}
				</Button>
			</DialogContent>
		</Dialog>
	);
}
