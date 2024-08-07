import { Router } from "express";

import verificarAutenticacion from "../middlewares/auth.js";
import {
    actualizarPaciente,
    detallePaciente,
    eliminarPaciente,
    listarPacientes,
    registrarPaciente,
    loginPaciente,
    perfilPaciente,
} from "../controllers/paciente.controller.js";

const router = Router();

router.post("/pacientes/registro", verificarAutenticacion, registrarPaciente);
router.post("/pacientes/login", loginPaciente);
router.get("/paciente/perfil", verificarAutenticacion, perfilPaciente);
router.get("/pacientes", verificarAutenticacion, listarPacientes);
router.get("/paciente/:id", verificarAutenticacion, detallePaciente);
router.put("/paciente/:id", verificarAutenticacion, actualizarPaciente);
router.delete("/paciente/:id", verificarAutenticacion, eliminarPaciente);

export default router;