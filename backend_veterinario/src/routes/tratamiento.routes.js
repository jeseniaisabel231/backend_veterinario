import { Router } from "express";
import {
    detalleTratamiento,
    registrarTratamiento,
    actualizarTratamiento,
    eliminarTratamiento,
    cambiarEstado
} from "../controllers/tratamiento.controller.js";
import verificarAutenticacion from "../middlewares/auth.js";

const router = Router();

router.post('/tratamiento/registro', verificarAutenticacion, registrarTratamiento)

router.patch('/tratamiento/estado/:id', verificarAutenticacion, cambiarEstado)

router
    .route('/tratamiento/:id')
    .get(verificarAutenticacion, detalleTratamiento)
    .put(verificarAutenticacion, actualizarTratamiento)
    .delete(verificarAutenticacion, eliminarTratamiento)

export default router