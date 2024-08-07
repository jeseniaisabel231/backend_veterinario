import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs"

const veterinarioSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true,
        default: null
    },
    telefono: {
        type: Number,
        trim: true,
        default: null
    },
    email: {
        type: String,
        require: true,
        trim: true,
		unique: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        default: null
    },
    confirmEmail: {
        type: Boolean,
        default: false
    }
}, {
    timestamps:true
})

veterinarioSchema.methods.encryptPassword = async (password) => {
    return await bcrypt.hash(password, await bcrypt.genSalt(10));
}

veterinarioSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

veterinarioSchema.methods.crearToken = function() {
    this.token = Math.random().toString(36).slice(2);
}

export default model('Veterinario', veterinarioSchema);