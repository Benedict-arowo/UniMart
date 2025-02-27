"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SearchFiltersProps {
	onFilter: (filters: {
		priceRange: number[];
		category: string;
		location: string;
		sellerRating: string;
		condition: string;
	}) => void;
}

export function SearchFilters({ onFilter }: SearchFiltersProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [priceRange, setPriceRange] = useState([0, 1000]);
	const [category, setCategory] = useState("");
	const [location, setLocation] = useState("");
	const [sellerRating, setSellerRating] = useState("");
	const [condition, setCondition] = useState("");

	const handleFilter = () => {
		onFilter({
			priceRange,
			category,
			location,
			sellerRating,
			condition,
		});
	};

	return (
		<div className="bg-secondary p-4 rounded-lg">
			<Button
				onClick={() => setIsExpanded(!isExpanded)}
				variant="ghost"
				className="w-full flex justify-between items-center">
				<span>Filters</span>
				{isExpanded ? <ChevronUp /> : <ChevronDown />}
			</Button>
			{isExpanded && (
				<div className="space-y-4 mt-4">
					<div>
						<Label>Price Range</Label>
						<Slider
							min={0}
							max={1000}
							step={10}
							value={priceRange}
							onValueChange={setPriceRange}
							className="mt-2"
						/>
						<div className="flex justify-between mt-2">
							<span>${priceRange[0]}</span>
							<span>${priceRange[1]}</span>
						</div>
					</div>

					<div>
						<Label>Category</Label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="textbooks">
									Textbooks
								</SelectItem>
								<SelectItem value="electronics">
									Electronics
								</SelectItem>
								<SelectItem value="furniture">
									Furniture
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Location</Label>
						<Input
							type="text"
							placeholder="Enter location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>

					<div>
						<Label>Seller Rating</Label>
						<Select
							value={sellerRating}
							onValueChange={setSellerRating}>
							<SelectTrigger>
								<SelectValue placeholder="Select minimum rating" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="4">4+ Stars</SelectItem>
								<SelectItem value="3">3+ Stars</SelectItem>
								<SelectItem value="2">2+ Stars</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Condition</Label>
						<Select value={condition} onValueChange={setCondition}>
							<SelectTrigger>
								<SelectValue placeholder="Select condition" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="new">New</SelectItem>
								<SelectItem value="used">Used</SelectItem>
								<SelectItem value="refurbished">
									Refurbished
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button onClick={handleFilter} className="w-full">
						Apply Filters
					</Button>
				</div>
			)}
		</div>
	);
}
