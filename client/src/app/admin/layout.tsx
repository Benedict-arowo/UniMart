"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Users,
	Store,
	Package,
	MessageSquare,
	BarChart,
	Settings,
	ShieldAlert,
	CreditCard,
	UserCog,
	Palette,
} from "lucide-react";

const sidebarItems = [
	{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ name: "Users", href: "/admin/users", icon: Users },
	{ name: "Stores", href: "/admin/stores", icon: Store },
	{ name: "Products", href: "/admin/products", icon: Package },
	{ name: "Messages", href: "/admin/messages", icon: MessageSquare },
	{ name: "Analytics", href: "/admin/analytics", icon: BarChart },
	{ name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
	{ name: "Roles & Themes", href: "/admin/roles-and-themes", icon: UserCog },
	{ name: "Settings", href: "/admin/settings", icon: Settings },
	{ name: "Moderation", href: "/admin/moderation", icon: ShieldAlert },
];

export default function AdminDashboardLayout({
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
						Admin Dashboard
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
