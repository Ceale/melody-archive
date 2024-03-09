import mongodbClient from "~/server/utils/useMongodb"

export default defineEventHandler( async () => {
    try {
        await mongodbClient.connect()
        const collection = mongodbClient.db("MelodyArchive").collection("music")
        await collection.deleteMany()
        return {
            state: "success"
        }
    } finally {
        await mongodbClient.close()
    }
})