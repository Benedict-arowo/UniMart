import Joi from "joi";

export const createStoreSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
});

export const updateStoreSchema = Joi.object({
	name: Joi.string().optional(),
	description: Joi.string().optional(),
	isActive: Joi.boolean().optional(),
	customUrl: Joi.string().optional(),
});

export interface IStore {
	name: string;
	description: string;
	isActive: boolean;
	customUrl?: string;
}
