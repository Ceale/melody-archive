<script setup>
import { NSpace, NButton } from "naive-ui"
let id = ""
const name = ref("")
const tag = ref([])
const author = ref([])
const link = ref("")

const notification = useNotification()

onMounted(() => {
    $fetch( "/api/get/music", {
        method: "POST",
        query: {
            id: useRoute().params.id
        }
    }).then((data) => {
        if (data.state == "error" || data.state == "notfound") showError({
            statusCode: 404,
            statusMessage: "页面未找到",
            fatal: true
        })
        id = data.music._id
        name.value = data.music.name
        tag.value = data.music.tag
        author.value = data.music.author
        link.value = data.music.link
    })
})

function update() {
    $fetch( "/api/update/music", {
        method: "POST",
        query: {
            id
        },
        body: {
            data: {
                name: name.value,
                tag: tag.value,
                author: author.value,
                link: link.value
            }
        }
    }).finally(() => {
        notification.success({
            title: "修改成功",
            duration: 2500
        })
    })
}

function remove() {
    const confirm = notification.warning({
        closable: false,
        title: "确认删除？",
        description: "删除后不可还原，请三思",
        meta: " ",
        action: () => h(
            NSpace,
            {},
            () => [
                h(
                    NButton,
                    {
                        tertiary: true,
                        round: true,
                        onClick: () => confirm.destroy()
                    },
                    () => "取消"
                ),
                h(
                    NButton,
                    {
                        strong: true,
                        secondary: true,
                        round: true,
                        type: "error",
                        onClick: () => {
                            confirmRemove()
                            confirm.destroy()
                        }
                    },
                    () => "确认"
                )
            ]
          ),
    })
}

function confirmRemove() {
    $fetch("/api/remove/music", {
        method: "POST",
        query: {
            id: id
        }
    }).finally(() => {
        notification.success({
            title: "删除成功",
            duration: 2500
        })
    })
    useRouter().go(-1)
    // router.go()
}
</script>


<template>
    <n-card class="gap">
        <n-breadcrumb class="breadcrumb" separator="/">
            <n-breadcrumb-item href="/">首页</n-breadcrumb-item>
            <n-breadcrumb-item href="/manage">管理音乐</n-breadcrumb-item>
            <n-breadcrumb-item>编辑音乐</n-breadcrumb-item>
        </n-breadcrumb>
    </n-card>
    
    
    <n-card title="修改信息" class="gap">
        <n-form-item label="名称">
            <n-input v-model:value="name" placeholder="音乐名称" />
        </n-form-item>

        <n-form-item label="标签">
            <n-dynamic-tags v-model:value="tag" />
        </n-form-item>

        <n-form-item label="作者">
            <n-dynamic-tags v-model:value="author" />
        </n-form-item>

        <n-form-item label="参考链接">
            <n-input v-model:value="link" placeholder="如音乐的链接" />
        </n-form-item>

        <n-space justify="end">
            <n-button strong tertiary round type="primary" @click="update()">
                修改
            </n-button>
        </n-space>
    </n-card>

    <n-card class="gap" title="删除数据">
        <p class="gap">操作不可撤销。</p>
        <n-button strong secondary round type="warning" @click="remove()">
            删除
        </n-button>
    </n-card>
</template>


<style scoped>

</style>