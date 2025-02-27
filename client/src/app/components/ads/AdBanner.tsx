"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ads = [
	{
		id: 1,
		image: "/images/banner-placeholder.svg",
		alt: "Special Offer on Textbooks",
		link: "/category/textbooks",
	},
	{
		id: 2,
		image: "/images/banner-placeholder.svg",
		alt: "New Electronics Arrivals",
		link: "/category/electronics",
	},
	{
		id: 3,
		image: "/images/banner-placeholder.svg",
		alt: "Dorm Essentials Sale",
		link: "/category/dorm-essentials",
	},
];

export function AdBanner() {
	const [currentAd, setCurrentAd] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const nextAd = () => setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
	const prevAd = () =>
		setCurrentAd((prevAd) => (prevAd - 1 + ads.length) % ads.length);

	return (
		<div className="relative w-full h-[400px] overflow-hidden">
			{ads.map((ad, index) => (
				<div
					key={ad.id}
					className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
						index === currentAd ? "opacity-100" : "opacity-0"
					}`}>
					<Image
						src={ad.image}
						alt={ad.alt}
						fill
						style={{ objectFit: "cover" }}
					/>
					<div className="absolute bottom-4 left-4 bg-primary bg-opacity-80 text-primary-foreground p-2 rounded">
						{ad.alt}
					</div>
				</div>
			))}
			<Button
				variant="outline"
				size="icon"
				className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary bg-opacity-50 hover:bg-opacity-75 text-primary-foreground"
				onClick={prevAd}>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary bg-opacity-50 hover:bg-opacity-75 text-primary-foreground"
				onClick={nextAd}>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
