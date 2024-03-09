import { ObjectId } from "mongodb"
import mongodbClient from "~/server/utils/useMongodb"

export default defineEventHandler( async (event) => {
    const param = getQuery(event)
    const body = await readBody(event)
    const id = param.id
    const music = body.data
    try {
        await mongodbClient.connect()
        const collection = mongodbClient.db("MelodyArchive").collection("music")
        
        await collection.updateOne({_id: new ObjectId(id)}, {$set: music})
        return {
            state: "success"
        }
    } finally {
        await mongodbClient.close()
    }
})