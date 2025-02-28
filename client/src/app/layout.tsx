import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import { Chat } from "./components/Chat";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "UniMarket - Your University Marketplace",
	description: "Connect with student sellers in your university",
};

// export default function RootLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	return (
// 		<html lang="en">
// 			<body className={inter.className}>
// 				<AuthProvider>
// 					<Header />
// 					<main className="min-h-screen">{children}</main>
// 					<Footer />
// 					<Chat />
// 				</AuthProvider>
// 			</body>
// 		</html>
// 	);
// }
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					{/* Now Header has access to Auth Context */}
					<Header />
					<main className="min-h-screen">{children}</main>
					<Footer />
					<Chat />
				</AuthProvider>
			</body>
		</html>
	);
}
