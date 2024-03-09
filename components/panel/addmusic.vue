<script setup>
import { NButton, NSpace, NInput, NDynamicTags } from "naive-ui"

const notification = useNotification()

const tab = ref("one")

const data = ref([{name: "", tag: [], author: [], link: ""}])

function getValueByPath(obj, path) {
    return path.reduce((o, k) => (o || {})[k], obj);
}

const batchColumn = [
    {
        title: "曲名",
        width: 160,
        render(row, index) {
            return h( NInput, {
                placeholder: "",
                size: "small",
                value: data.value[index].name,
                onUpdateValue(v) {
                    data.value[index].name = v
                }
            })
        }
    },
    {
        title: "标签",
        width: 180,
        render(row, index) {
            return h( NDynamicTags, {
                size: "small",
                value: data.value[index].tag,
                onUpdateValue(v) {
                    data.value[index].tag = v
                }
            })
        }
    },
    {
        title: "作者",
        width: 160,
        render(row, index) {
            return h( NDynamicTags, {
                size: "small",
                value: data.value[index].author,
                onUpdateValue(v) {
                    data.value[index].author = v
                }
            })
        }
    },
    {
        title: "参考链接",
        width: 180,
        render(row, index) {
            return h( NInput, {
                placeholder: "",
                size: "small",
                value: data.value[index].link,
                onUpdateValue(v) {
                    data.value[index].link = v
                }
            })
        }
    },
    {
        render(row, index) {
            if (index != 0) return h( NSpace, {
                justify: "end"
            },
            () => h(
                NButton, {
                    strong: true,
                    quaternary: true,
                    size: "small",
                    type: "error",
                    onClick: () => {
                        data.value.splice(index, 1)
                    } 
                }, () => "删除"
            ))
        }
    }
]

function addBatch() {
    data.value.push({name: "", tag: [], author: [], link: ""})
}




function addMusic() {
    for (const music of data.value) {
        if ( !music.name ) {
            notification.warning({
                title: "添加失败",
                description: "名称不应为空",
                duration: 2500
            })
            return
        }

        if ( !music.tag.length ) {
            notification.warning({
                title: "添加失败",
                description: "应至少有一个标签",
                duration: 2500
            })
            return
        } else {
            for (const iterator of music.tag) {
                if ( !iterator.trim().length ) {
                    notification.warning({
                        title: "添加失败",
                        description: "标签不应为空",
                        duration: 2500
                    })
                    return
                }
            }
        }

        if ( music.author.length ) {
            for (const iterator of music.author) {
                if ( !iterator.trim().length ) {
                    notification.warning({
                        title: "添加失败",
                        description: "作者不应为空",
                        duration: 2500
                    })
                    return
                }
            }
        }
    }

    $fetch("/api/add/music", {
        method: "POST",
        body: data.value
    }).then((result) => {
        if (result.result.acknowledged) {
            data.value = [{name: "", tag: [], author: [], link: ""}]
            notification.success({
                title: "添加成功",
                duration: 2500
            })
        } else {
            notification.error({
                title: "添加失败",
                description: "服务端发生错误",
                duration: 2500
            })
        }
    })
}

</script>


<template>
    <n-card class="gap" title="添加音乐">

        <n-tabs default-value="one" size="small" :bar-width="25" animated pane-wrapper-style="margin-top: 12px"
            v-model:value="tab">

            <n-tab-pane name="one" tab="逐首添加" display-directive="if">

                <n-form-item label="名称">
                    <n-input v-model:value="data[0].name" placeholder="音乐名称" />
                </n-form-item>

                <n-form-item label="标签">
                    <n-dynamic-tags v-model:value="data[0].tag" />
                </n-form-item>

                <n-form-item label="作者">
                    <n-dynamic-tags v-model:value="data[0].author" />
                </n-form-item>

                <n-form-item label="参考链接">
                    <n-input v-model:value="data[0].link" placeholder="如音乐的链接" />
                </n-form-item>
            </n-tab-pane>

            <n-tab-pane name="batch" tab="批量添加" display-directive="if">
                <n-data-table :columns="batchColumn" :data="data" :bordered="false" class="gap"/>
                <n-button strong quaternary type="info" @click="addBatch" class="gap" style="width: 100%;">新增音乐</n-button>
            </n-tab-pane>
        </n-tabs>

        <n-space justify="end">
            <n-button strong tertiary round type="primary" @click="addMusic()">
                添加
            </n-button>
        </n-space>

    </n-card>
</template>


<style scoped>

</style>