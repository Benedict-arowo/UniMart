import { Request } from "express";
import { Socket } from "socket.io";

export interface Req extends Request {
	user?: any;
}

export interface Sock extends Socket {
	user?: any;
}
