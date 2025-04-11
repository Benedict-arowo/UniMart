import { Response } from "express";
import { Req } from "../utils/types";
import { StatusCodes } from "http-status-codes";
import ChatService from "../services/chat.service";

class ChatController {
	service = new ChatService();

	getChats = async (req: Req, res: Response) => {
		const {
			query: { limit = 10, page = 1 },
			user: { id },
		} = req;
		const chats = await this.service.getChats(
			id,
			Number(limit),
			Number(page)
		);

		return res.status(StatusCodes.OK).json({
			success: true,
			data: { chats },
		});
	};
}

export default ChatController;
