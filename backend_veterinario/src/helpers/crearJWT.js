import jwt from 'jsonwebtoken'

const generarToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

export default generarToken