import express from "express";
import Wrapper from "../middlewears/Wrapper";
import ChatController from "../controllers/chat.controller";
import authenticatedOnly from "../middlewears/authenticated";

const router = express.Router();
const controller = new ChatController();

router.get("/", authenticatedOnly, Wrapper(controller.getChats));

export default {
	routeUrl: "chat",
	Router: router,
};
