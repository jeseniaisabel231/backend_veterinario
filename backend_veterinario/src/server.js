import express from "express";
import cors from "cors";
import routerVeterinario from "./routes/veterinario.routes.js";
import routerPaciente from "./routes/paciente.routes.js";
import routerTratamiento from "./routes/tratamiento.routes.js";
import "dotenv/config";
import morgan from "morgan";
import { createServer } from "http";

const app = express();
app.use(morgan("dev"));

app.use(
	cors({
		origin: "*"
	})
);
app.use(express.json());

app.get("/", (_, res) => res.send("Server on"));

app.use("/api", routerVeterinario);
app.use("/api", routerPaciente);
app.use("/api", routerTratamiento);
app.use((_, res) => res.status(404).json({ res: "404 - Endpoint not found" }));

const server = createServer(app);

export default server;
