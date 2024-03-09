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
        
        const music = await collection.findOne({_id: new ObjectId(id)})
        if (!music) return {
            state: "notfound",
            message: "找不到对应音乐"
        }
        return {
            state: "success",
            music: music
        }
    } finally {
        await mongodbClient.close()
    }
})