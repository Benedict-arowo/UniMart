import { BadrequestError } from "../middlewears/error";
import { RefineUser } from "../middlewears/validator/auth.validator";
import prisma from "../prisma";

class UserService {
	getUser = async (userId: string) => {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) throw new BadrequestError("User not found.");

		return RefineUser(user);
	};
}

export default UserService;
