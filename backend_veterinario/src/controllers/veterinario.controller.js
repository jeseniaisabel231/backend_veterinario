import mongoose from "mongoose"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarToken from "../helpers/crearJWT.js"
import Veterinario from "../models/veterinario.js"


const registro = async (req, res) => {
    const { email, password } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    if (await Veterinario.findOne({ email })) return res.status(400).json({ res: 'El email ya se encuentra registrado' })
    
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encryptPassword(password)
    await nuevoVeterinario.crearToken()
    sendMailToUser(email, nuevoVeterinario.token)
    await nuevoVeterinario.save()

    res.status(201).json({ res: 'Registro exitoso, revise su email para confirmar su cuenta' })
}

const confirmEmail = async (req, res) => {
    if(!(req.params.token)) return res.status(400).json({ res: "Lo sentimos, no se puede validar la cuenta" })
    
    const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })
        
    if(!veterinarioBDD?.token) return res.status(404).json({ res: "La cuenta ya ha sido confirmada" })
        
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail = true
        
    await veterinarioBDD.save()
    
    res.status(200).json({ res: "Token confirmado, ya puedes iniciar sesión" }) 
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (Object.values(req.body).includes('')) return res.status(404).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })
    
    const veterinarioBDD = await Veterinario.findOne({ email }).select('-status -__v -createdAt -updatedAt -token')

    if (!veterinarioBDD) return res.status(404).json({ res: 'El email no se encuentra registrado' })

    if (veterinarioBDD?.confirmEmail === false) return res.status(403).json({ res: 'Confirme su email para poder iniciar sesión' })

    const verificarPassword = await veterinarioBDD.matchPassword(password)

    if (!verificarPassword) return res.status(401).json({ res: 'Contraseña incorrecta' })

    const token = generarToken(veterinarioBDD._id, 'veterinario')
    const { nombre, apellido, direccion, telefono, _id } = veterinarioBDD

    res.status(200).json({ res: 'Login exitoso', token, nombre, apellido, direccion, telefono, _id, email })
}

const recuperarPassword = async (req, res) => {
    const { email } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    const veterinarioBDD = await Veterinario.findOne({ email })

    if (!veterinarioBDD) return res.status(404).json({ res: 'El email no se encuentra registrado' })

    await veterinarioBDD.crearToken()

    sendMailToRecoveryPassword(email, veterinarioBDD.token)

    await veterinarioBDD.save()

    res.status(200).json({ res: 'Correo enviado, revise su bandeja de entrada' })
}

const comprobarTokenPasword = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ res: 'Token no encontrado' })

    const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })

    if (veterinarioBDD?.token !== req.params.token) return res.status(404).json({ res: 'Token no válido' })

    await veterinarioBDD.save()

    res.status(200).json({ res: 'Token confirmado, puede cambiar su contraseña' })
}

const nuevoPassword = async (req, res) => {
    const { password, confirmPassword } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    if (password !== confirmPassword) return res.status(400).json({ res: 'Las contraseñas no coinciden' })

    const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })

    if (veterinarioBDD?.token !== req.params.token) return res.status(404).json({ res: 'Token no válido nuevo password' })

    veterinarioBDD.token = null
    veterinarioBDD.password = await veterinarioBDD.encryptPassword(password)

    await veterinarioBDD.save()

    res.status(200).json({ res: 'Felicidades, su contraseña ha sido actualizada' })
}

const perfil = (req, res) => {
    if (!req.veterinarioBDD) return res.status(404).json({ res: 'No se encuentra el veterinario, inicie sesión nuevamente' })
    
    delete req.veterinarioBDD.token
    delete req.veterinarioBDD.confirmEmail
    delete req.veterinarioBDD.createdAt
    delete req.veterinarioBDD.updatedAt
    delete req.veterinarioBDD.__v

    req.veterinarioBDD.rol = 'veterinario'

    res.status(200).json(req.veterinarioBDD)
}

const listarVeterinarios = async (_, res) => {
    res.status(200).json(await Veterinario.find().select('-password -token -confirmEmail -createdAt -updatedAt -__v'))
}

const detalleVeterinario = async (_, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ res: `ID ${id} no válido` })

    const veterinarioBDD = await Veterinario.findById(id).select('-password')

    res.status(200).json(veterinarioBDD)
}

const actualizarPerfil = async (req, res) => {
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ res: `ID ${id} no válido` })
    
    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    const veterinarioBDD = await Veterinario.findById(id)
    
    if(!veterinarioBDD) return res.status(404).json({ res: `No existe el veterinario ${id}` })
    
    if (veterinarioBDD.email != req.body.email) {
        const veterinarioBDDMail = await Veterinario.findOne({ email: req.body.email })
        if (veterinarioBDDMail) return res.status(404).json({ res: 'El email ya se encuentra registrado'})  
    }

	veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre
    veterinarioBDD.apellido = req.body.apellido  || veterinarioBDD?.apellido
    veterinarioBDD.direccion = req.body.direccion ||  veterinarioBDD?.direccion
    veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono
    veterinarioBDD.email = req.body.email || veterinarioBDD?.email
    
    await veterinarioBDD.save()
    
    res.status(200).json({ res: 'Perfil actualizado correctamente'})
}

const actualizarPassword = async (req, res) => {
    const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)

    const verificarPassword = await veterinarioBDD.matchPassword(req.body.password)

    if (!verificarPassword) return res.status(401).json({ res: 'Contraseña incorrecta' })

    veterinarioBDD.password = await veterinarioBDD.encryptPassword(req.body.newPassword)

    await veterinarioBDD.save()

    res.status(200).json({ res: 'Contraseña actualizada' })
}

export {
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
	nuevoPassword
}