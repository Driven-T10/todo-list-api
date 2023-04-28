import dayjs from "dayjs"
import { db } from "../database/database.config.js"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import { ObjectId } from "mongodb"
dayjs.extend(customParseFormat)

export async function createTask(req, res) {
    const { description } = req.body
    const userId = res.locals.session.userId

    try {
        const task = { description, date: dayjs().valueOf(), done: false, userId }
        await db.collection("tasks").insertOne(task)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getTasks(req, res) {
    const { filterDate } = req.query // DD-MM-YYYY
    const timestamp = dayjs(filterDate, "DD-MM-YYYY").valueOf()
    const userId = res.locals.session.userId

    try {
        const tasks = await db.collection("tasks")
            .find({ userId, date: { $gte: timestamp || 0 } })
            .toArray()

        res.send(tasks)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function changeTaskStatus(req, res) {
    const { id } = req.params
    const userId = res.locals.session.userId

    try {
        const task = await db.collection("tasks").findOne({ _id: new ObjectId(id), userId })
        if (!task) return res.sendStatus(404)

        await db.collection("tasks").updateOne(
            { _id: new ObjectId(id) },
            { $set: { done: !task.done } }
        )
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteTask(req, res) {
    const { id } = req.params
    const userId = res.locals.session.userId

    try {
        const task = await db.collection("tasks").deleteOne({ _id: new ObjectId(id), userId })
        if (task.deletedCount === 0) return res.sendStatus(404)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function editTask(req, res) {
    const { id } = req.params
    const { description } = req.body
    const userId = res.locals.session.userId

    try {
        const task = await db.collection("tasks").updateOne(
            { _id: new ObjectId(id), userId },
            { $set: { description } }
        )
        if (task.matchedCount === 0) return res.sendStatus(404)
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}