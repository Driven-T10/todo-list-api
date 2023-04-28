import { db } from "../database/database.config.js"

export default async function validateAuth(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)  

    try {
        const session = await db.collection("sessions").findOne({ token })
        if (!session) return res.status(401).send("Token inválido")

        res.locals.session = session

        next()

    } catch (err) {
        res.status(500).send(err.message)
    }
}