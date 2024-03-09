import mongodbClient from "~/server/utils/useMongodb"

export default defineEventHandler( async (event) => {
    const param = getQuery(event)
    const body = await readBody(event)
    try {
        await mongodbClient.connect()
        const collection = mongodbClient.db("MelodyArchive").collection("music")
        
        const result = await collection.aggregate(pipeline(param, body)).toArray()

        const count = await collection.countDocuments(countParam(body))
        const limit = parseInt(param.size) || 15
        const size = Math.ceil( count / limit )
        
        return {
            state: "success",
            count: size,
            list: result
        }
    } finally {
        await mongodbClient.close()
    }
})

function pipeline(param, body) {
    const page = parseInt(param.number) || 1
    const limit = parseInt(param.size) || 15
    const tag = body.tag

    let $match = {}
    let $addFields = {}
    let $sort = { _id: -1 }
    let $skip = limit * (page - 1)
    let $limit = limit
    let $project = {}

    if ( tag.length != 0 ) {
        $match.tag = { $in: tag }
        $addFields.numMatchingTags = {
            $size: {
                $filter: {
                    input: "$tag",
                    as: "tag",
                    cond: { $in: ["$$tag", tag] }
                }
            }
        }
        $sort = {
            numMatchingTags: -1,
            _id: -1
        }
    }
    
    const pipeline = [
        { $sort },
        { $skip },
        { $limit },
        // { $project }
    ]
    if ( Object.keys($addFields).length !== 0 ) {
        pipeline.unshift({ $addFields })
    }
    if ( Object.keys($match).length !== 0 ) {
        pipeline.unshift({ $match })
    }
    return pipeline
}

function countParam(body) {
    const tag = body.tag

    const query = {}

    if ( tag.length != 0 ) {
        query.tag = { $in: tag }
    }

    return query
}




// let query = {
//     $text: {
//         $search: tags.join(" ")
//     }
// }

// // 使用聚合管道进行查询和排序
// return db[collectionName].aggregate([
//     {
//         $match: {
//             $text: {
//                 $search: tags.join(" ")
//             }
//         }
//     },
//     {
//         $addFields: {
//             matchCount: {
//                 $size: {
//                     $setIntersection: [
//                         "$tag",
//                         tags.map(tag => new RegExp(tag, "i"))
//                     ]
//                 }
//             }
//         }
//     },
//     {
//         $sort: {
//             matchCount: -1
//         }
//     }
// ]).toArray();







// const pipeline = [
//     { $match: { tag: { $in: tag } } }, // 使用传入的参数数组作为匹配条件
//     {
//         $addFields: {
            // numMatchingTags: {
            //     $size: {
            //         $filter: {
            //             input: "$tag",
            //             as: "tag",
            //             cond: { $in: ["$$tag", tag] } // 使用传入的参数数组作为条件表达式
            //         }
            //     }
            // }
//         }
//     },
//     {
//         $sort: {
//             id: 1, // 按照 id 键正序排序
//             numMatchingTags: -1  // 按照tag符合的数量排序
//         }
//     },
//     { $skip: limit * (page - 1) }, // 计算需要跳过的文档数量
//     { $limit: limit }, // 限制返回的文档数量
//     { $project: { _id: 0 } } // 排除 _id 字段
// ]