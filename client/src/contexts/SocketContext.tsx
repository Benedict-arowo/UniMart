"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

const SocketContext = createContext(null);

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const socketConnection = io(SOCKET_URL, {
			autoConnect: true, // We manually control when to connect
			withCredentials: true,
			transports: ["websocket"],
		});

		socketConnection.on("connect", () => {
			console.log("Connected to Socket.IO server");
		});

		socketConnection.on("disconnect", () => {
			console.log("Disconnected from Socket.IO server");
		});

		setSocket(socketConnection);

		return () => {
			socketConnection.close();
		};
	}, []);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};
