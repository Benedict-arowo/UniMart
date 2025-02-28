import { NextFunction, Response } from "express";
import { Req } from "../utils/types";

const authenticatedOnly = (req: Req, res: Response, next: NextFunction) => {
	console.log(req.cookies);
	next();
};

export default authenticatedOnly;
