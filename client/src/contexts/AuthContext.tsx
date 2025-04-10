"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { ChatProvider } from "./ChatContext";
import { NotificationProvider } from "./NotificationContext";
import { login as loginUser, logout as logoutUser } from "../services/auth";
import { getUser } from "@/services/user";

export interface User {
	id: string;
	email: string;
	roles: string[];
	username: string;
	verified: boolean;
	isOnline: boolean;
	lastOnline: Date;
	createdAt: Date;
	store: {
		id: string;
		name: string;
		description: string;
		customUrl: string | null;
		isActive: boolean;
		isBoosted: boolean | null;
		boostedAt: Date | null;
		boostExpiresAt: Date | null;
		banner: any | null;
	} | null;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkLoggedIn = async () => {
			try {
				const response = await getUser();
				if (!response.data) throw new Error();

				setUser(response.data);
			} catch (error) {
				console.error("Failed to fetch user:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkLoggedIn();
	}, []);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await loginUser({ email, password });
			if (!response.user) throw new Error("Login failed.");
			setUser(response.user);
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await fetch("/api/auth/logout", { method: "POST" });
			const response = await logoutUser();
			if (response) throw new Error("Error while trying to logout");
			setUser(null);
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			<NotificationProvider>
				<ChatProvider>{children}</ChatProvider>
			</NotificationProvider>
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
