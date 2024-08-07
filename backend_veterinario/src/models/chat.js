import { Schema, model, Types } from "mongoose";

const chatSchema = new Schema({
    mensaje: {
        type: String,
        required: true,
        trim: true,
    },
    emisor: {
        type: String,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    rol: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

export default model("Chat", chatSchema);