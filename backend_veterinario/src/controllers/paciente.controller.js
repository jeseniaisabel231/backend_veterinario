import { sendMailToPaciente } from '../config/nodemailer.js';
import generarToken from '../helpers/crearJWT.js';
import Paciente from '../models/paciente.js';
import Tratamiento from '../models/tratamiento.js';
import Veterinario from '../models/veterinario.js';
import { Types } from 'mongoose';

const registrarPaciente = async (req, res) => {
    const { email } = req.body;

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    const verificarEmailBDD = await Paciente.findOne({ email }) || await Veterinario.findOne({ email })

    if (verificarEmailBDD) return res.status(400).json({ res: 'El email ya se encuentra registrado' })

    const nuevoPaciente = new Paciente(req.body)

    const password = `vet${Math.random().toString(36).slice(2)}`
    nuevoPaciente.password = await nuevoPaciente.encryptPassword(password)
    nuevoPaciente.veterinario = req.veterinarioBDD._id

    await sendMailToPaciente(nuevoPaciente.email, password)
    await nuevoPaciente.save()

    res.status(201).json({ res: 'Paciente registrado correctamente' })
};

const loginPaciente = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })
    
    const pacienteBDD = await Paciente.findOne({ email })

    if (!pacienteBDD) return res.status(404).json({ res: 'Email no registrado' })

    const verificarPassword = await pacienteBDD.matchPassword(password)

    if (!verificarPassword) return res.status(401).json({ res: 'Contraseña incorrecta' })

    const token = generarToken(pacienteBDD._id, 'paciente')

    const { nombre, propietario, celular, convencional, _id } = pacienteBDD

    res.status(200).json({ token, _id, nombre, propietario, email, celular, convencional })
};

const perfilPaciente = (req, res) => {

    delete req.pacienteBDD.password
    delete req.pacienteBDD.createdAt
    delete req.pacienteBDD.updatedAt
    delete req.pacienteBDD.__v

    req.pacienteBDD.rol = 'paciente'

    res.status(200).json(req.pacienteBDD)
};

const listarPacientes = async (req, res) => {

    if (req.pacienteBDD && "propietario" in req.pacienteBDD) {
        res.status(200).json(await Paciente.find(req.pacienteBDD._id).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido'))
    } else {
        res.status(200).json(await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido'))
    }

};

const detallePaciente = async (req, res) => {
    const { id } = req.params
    
    const paciente = await Paciente.findById(id).where('veterinario').equals(req.veterinarioBDD).select('-createdAt -updatedAt -__v -password -tratamientos').populate('veterinario', 'nombre apellido')

    const tratamientos = await Tratamiento.find({ estado: true }).where('paciente').equals(id)

    if (!paciente) return res.status(404).json({ res: 'Paciente no encontrado' })

    res.status(200).json({ paciente, tratamientos })
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ res: `ID ${id} no válido` })

    if (Object.values(req.body).includes('')) return res.status(400).json({ res: 'Rellene todos los campos antes de enviar la solicitud' })

    await Paciente.findByIdAndUpdate(id, req.body)

    res.status(200).json({ res: 'Paciente actualizado correctamente' })
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params

    if( !Types.ObjectId.isValid(id) ) return res.status(404).json({ res: `ID ${id} no válido`})

    await Paciente.findByIdAndUpdate(id, { salida: Date.now(), estado: false })

    res.status(200).json({ res: 'Paciente eliminado correctamente' })
};

export {
    loginPaciente,
    perfilPaciente,
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente,
};