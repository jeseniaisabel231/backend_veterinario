import { set as setOptions, connect } from "mongoose";

setOptions("strictQuery", true);

export default async () => {
	try {
		const { connection } = await connect(
			process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI_PRODUCTION
		);
		console.log(
			`Database is connected on ${connection.host} - ${connection.port}`
		);
	} catch (error) {
		console.error(error);
	}
};
