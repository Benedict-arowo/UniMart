import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { Chat } from "./components/Chat";
import { AuthProvider } from "@/contexts/AuthContext";
import EmailVerificationBanner from "./components/EmailVerificationBanner";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	adjustFontFallback: false,
});

export const metadata: Metadata = {
	title: "UniMarket - Your University Marketplace",
	description: "Connect with student sellers in your university",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<WishlistProvider>
						<Header />
						<Toaster />
						<main className="min-h-screen">
							<EmailVerificationBanner />
							{children}
						</main>
						<Footer />
						<Chat />
					</WishlistProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
