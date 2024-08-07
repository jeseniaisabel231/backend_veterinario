import jwt from 'jsonwebtoken'
import Veterinario from '../models/veterinario.js'
import Paciente from '../models/paciente.js'

const verificarAutenticacion = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) return res.status(401).json({ res: 'Acceso denegado, proporciona un token válido' })

    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)

        if (rol === 'veterinario') {
            req.veterinarioBDD = await Veterinario.findById(id).lean().select('-password')
        } else if (rol === 'paciente') {
            req.pacienteBDD = await Paciente.findById(id).lean().select('-password')
        }
        
        next()

    } catch (error) {
        const e = new Error('Token no válido o expirado, comuníquese con soporte técnico')
        console.log(error) // Error para el desarrollador
        return res.status(401).json({ res: e })
    }
}

export default verificarAutenticacion