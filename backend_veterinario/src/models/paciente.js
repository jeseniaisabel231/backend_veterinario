import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

const pacienteSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
    },
    propietario: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    },
    celular: {
        type: String,
        require: true,
        trim: true,
    },
    convencional: {
        type: String,
        require: true,
        trim: true,
    },
    ingreso: {
        type: Date,
        require: true,
        trim: true,
        default: Date.now(),
    },
    sintomas: {
        type: String,
        require: true,
        trim: true,
    },
    salida: {
        type: Date,
        require: true,
        trim: true,
        default: Date.now(),
    },
    estado: {
        type: Boolean,
        default: true,
    },
    veterinario: {
        type: Types.ObjectId,
        ref: "Veterinario",
    },
    tratamientos: [
        {
            type: Types.ObjectId,
            ref: 'Tratamiento'
        }
    ]
},
{
    timestamps: true,
});

pacienteSchema.methods.encryptPassword = async (password) => {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
};

pacienteSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default model("Paciente", pacienteSchema);
