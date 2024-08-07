import Tratamiento from "../models/tratamiento.js";
import mongoose from "mongoose";

const registrarTratamiento = async (req, res) => {
	const { paciente } = req.body;

	if (!mongoose.Types.ObjectId.isValid(paciente))
		return res
			.status(404)
			.json({ res: `No existe el tratamiento con el id ${paciente}` });

	const tratamiento = await Tratamiento.create(req.body);

	res
		.status(201)
		.json({
			res: `Registro exitoso del tratamiento ${tratamiento._id}`,
			tratamiento,
		});
};

const detalleTratamiento = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(404)
			.json({ res: `No existe el tratamiento con el id ${id}` });

	res
		.status(200)
		.json(
			await Tratamiento.findById(id).populate("paciente", "_id nombre celular")
		);
};

const actualizarTratamiento = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(404)
			.json({ res: `No existe el tratamiento con el id ${id}` });

	await Tratamiento.findByIdAndUpdate(id, req.body);

	res.status(200).json({ res: `Tratamiento ${id} actualizado` });
};

const eliminarTratamiento = async (req, res) => {
	await Tratamiento.findByIdAndDelete(req.params.id);

	res.status(200).json({ res: `Tratamiento ${req.params.id} eliminado` });
};

const cambiarEstado = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res
			.status(404)
			.json({ res: `No existe el tratamiento con el id ${id}` });

	await Tratamiento.findByIdAndUpdate(id, { estado: false });

	res.status(200).json({ res: `Estado del tratamiento ${id} cambiado` });
};

export {
	detalleTratamiento,
	registrarTratamiento,
	actualizarTratamiento,
	eliminarTratamiento,
	cambiarEstado,
};
