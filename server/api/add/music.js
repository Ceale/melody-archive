import mongodbClient from "~/server/utils/useMongodb"

export default defineEventHandler( async (event) => {
    const list = await readBody(event)
    list.forEach(e => {
        if ( e.author.length == 0 ) e.author = ["未知"]
    })
    try {
        await mongodbClient.connect()
        const collection = mongodbClient.db("MelodyArchive").collection("music")
        const result = await collection.insertMany(list)
        return {
            state: "success",
            result,
        }
    } finally {
        await mongodbClient.close()
    }
})