import server from "./server.js";
import connection from "./database.js";
import mensajeria from "./config/mensajeria.js";

connection();

mensajeria();

server.listen(process.env.PORT || 3001, () =>
	console.log(`Server is running on http://localhost:${process.env.PORT || 3001}`)
);
