import { ObjectId } from "mongodb"
import mongodbClient from "~/server/utils/useMongodb"

export default defineEventHandler( async (event) => {
    const param = getQuery(event)
    if ( !param.id ) return {
        state: "error",
        message: "参数缺失"
    }
    if (!ObjectId.isValid(param.id)) return {
        state: "error",
        message: "参数错误"
    }
    const id = param.id
    try {
        await mongodbClient.connect()
        const collection = mongodbClient.db("MelodyArchive").collection("music")
        await collection.deleteOne({_id: new ObjectId(id)})
        return {
            state: "success"
        }
    } finally {
        await mongodbClient.close()
    }
})