"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Settings,
	Package,
	BarChart,
	CreditCard,
	MessageSquare,
	Star,
	Store,
	Share2,
} from "lucide-react";

const sidebarItems = [
	{ name: "Dashboard", href: "/seller-dashboard", icon: LayoutDashboard },
	{ name: "Products", href: "/seller-dashboard/products", icon: Package },
	{ name: "Store", href: "/seller-dashboard/store", icon: Store },
	{ name: "Analytics", href: "/seller-dashboard/analytics", icon: BarChart },
	{
		name: "Social Media",
		href: "/seller-dashboard/social-media",
		icon: Share2,
	},
	{
		name: "Subscription",
		href: "/seller-dashboard/subscription",
		icon: CreditCard,
	},
	{
		name: "Messages",
		href: "/seller-dashboard/messages",
		icon: MessageSquare,
	},
	{ name: "Reviews", href: "/seller-dashboard/reviews", icon: Star },
	{ name: "Settings", href: "/seller-dashboard/settings", icon: Settings },
];

export default function SellerDashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div className="flex h-screen bg-gray-100">
			<aside className="w-64 bg-white shadow-md">
				<div className="p-4">
					<h1 className="text-2xl font-bold text-gray-800">
						Seller Dashboard
					</h1>
				</div>
				<nav className="mt-4">
					{sidebarItems.map((item) => (
						<Link key={item.name} href={item.href}>
							<Button
								variant="ghost"
								className={`w-full justify-start ${
									pathname === item.href ? "bg-gray-200" : ""
								}`}>
								<item.icon className="mr-2 h-4 w-4" />
								{item.name}
							</Button>
						</Link>
					))}
				</nav>
			</aside>
			<main className="flex-1 overflow-y-auto p-8">{children}</main>
		</div>
	);
}
