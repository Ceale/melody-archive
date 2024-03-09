import mongodbClient from "~/server/utils/useMongodb"

export default defineEventHandler( async () => {
    try {
        await mongodbClient.connect()
        const collection = mongodbClient.db("MelodyArchive").collection("music")
        const count = await collection.countDocuments()

        const tags = await collection.aggregate([
            { $unwind: "$tag" },
            { $group: { _id: "$tag", count: { $sum: 1 } } },
            { $project: { _id: 0, name: "$_id", count: 1 } },
            { $sort: { count: -1 } }
        ]).toArray()

        return {
            state: "success",
            count,
            tags
        }
    } finally {
        await mongodbClient.close()
    }
})