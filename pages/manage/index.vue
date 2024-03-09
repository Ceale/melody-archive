<template>
    <n-card class="gap">

        <n-breadcrumb class="breadcrumb" separator="/">
            <n-breadcrumb-item href="/">首页</n-breadcrumb-item>
            <n-breadcrumb-item>管理音乐</n-breadcrumb-item>
        </n-breadcrumb>
    </n-card>

    <AddMusicPanel />

    <n-card class="gap" title="删除数据">
        <p class="gap">删除全部的数据。即全部的音乐，标签索引等。操作不可撤销。</p>
        <n-button strong secondary round type="warning" @click="remove()">
            删除
        </n-button>
    </n-card>
</template>

<script setup>
import { NButton, NSpace } from "naive-ui"
import AddMusicPanel from "~/components/panel/addmusic.vue"

const notification = useNotification()

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
    $fetch("/api/remove/list").finally(() => {
        notification.success({
            title: "删除成功",
            duration: 2500
        })
    })
}
</script>

<style>

</style>