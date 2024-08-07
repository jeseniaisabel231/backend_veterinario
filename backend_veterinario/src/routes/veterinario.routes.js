import { Router } from 'express'
import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
} from "../controllers/veterinario.controller.js";
import verificarAutenticacion from '../middlewares/auth.js';
import { validacionVeterinario } from '../middlewares/veterinario.validation.js';
import Chat from '../models/chat.js';

const router = Router()

router.get("/chats", async (_, res) => {
    res.status(200).json(await Chat.find());
});

router.post("/login", login);
router.post("/registro", validacionVeterinario, registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/veterinarios", verificarAutenticacion, listarVeterinarios);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

router.get("/perfil", verificarAutenticacion, perfil);
router.put('/veterinario/actualizarpassword', verificarAutenticacion, actualizarPassword)
router.get("/veterinario/:id", verificarAutenticacion, detalleVeterinario);
router.put("/veterinario/:id", verificarAutenticacion, actualizarPerfil);

export default router