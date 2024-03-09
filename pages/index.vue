<template>
    <n-card class="gap" title="统计">
        <n-statistic :tabular-nums="true" label="音乐数量" :value="meta.songCount" />
        <n-divider />
        <n-statistic :tabular-nums="true" label="标签数量">
            <n-space>
                <n-tag v-for="tag in meta.tags" :bordered="false" round>{{ tag.name }}<span
                        class="tag-count">{{ tag.count }}</span></n-tag>
            </n-space>
        </n-statistic>

        <n-divider />
        <n-space>
            <n-button strong tertiary round type="info" @click="refresh()">
                刷新
            </n-button>
            <n-button strong tertiary round type="info" @click="openManagePage()">
                管理音乐
            </n-button>
        </n-space>
    </n-card>

    <n-card class="gap" title="检索">

        <n-form-item label="标签" path="user.name">
            <n-dynamic-tags v-model:value="form.tag" />
        </n-form-item>

        <n-space justify="end">
            <n-button @click="reset()" strong secondary round type="info">
                重置
            </n-button>
            <n-button @click="query()" strong secondary round type="primary">
                检索
            </n-button>
        </n-space>


    </n-card>

    <n-data-table class="data-table gap" remote :columns="column" :data="list" :loading="loading"
        :scroll-x="columnWidth">
        <template #empty>
            <n-icon :component="MusicRemove" size="40" :depth="4" />
        </template>
    </n-data-table>


    <n-config-provider class="scrollbar-none" :locale="zhCN" :date-locale="dateZhCN">
        <n-pagination class="pagination" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
            :page="pageNumber" :page-size="pageSize" :page-count="pageCount" :page-sizes="pageSizes" show-size-picker />
    </n-config-provider>

</template>


<script setup>
import { h } from "vue"
import { NTag, NButton, NSpace, NEllipsis, zhCN, dateZhCN } from "naive-ui"
import { MusicRemove } from "@vicons/carbon"

const tooltip = {
    trigger: "hover",
    showArrow: false,
    style: "background: #fff; color: #000",
    
}

const column = [
    {
        title: "曲名",
        key: "name",
        width: 160,
        ellipsis: { tooltip }
    },
    {
        title: "标签",
        width: 260,
        render(row) {
            const formTag = form.value.tag
            const resultTag = []
            row.tag.forEach((t) => {
                if ( formTag.includes(t) ) {
                    resultTag.unshift(t)
                } else {
                    resultTag.push(t)
                }
            })
            return h(
                NSpace,
                {
                    wrap: false,
                    class: "scrollbar-none"
                },
                () => resultTag.map(text => 
                    h(
                        NTag,
                        {
                            size: "small",
                            round: true,
                            bordered: false,
                            type: formTag.length !=0 && formTag.includes(text) ? "success" : undefined,
                            style: "transition: background 200ms, color 200ms"
                        },
                        () => text
                    )
                )
                
            )
        }
    },
    {
        title: "作者",
        key: "author",
        width: 140,
        ellipsis: { tooltip },
        render(row) {
            return h(
                "span",
                row.author.join("、")
            )
        }
    },
    {
        title: "参考链接",
        width: 200,
        render(row) {
            return h(
                    NEllipsis,
                    {
                        style: "max-width: 200px; font-size: 10px; user-select: all;",
                        tooltip
                    },
                    () => row.link.replace(/.*:\/\//g, "")
            )
        }
    },
    {
        render(row) {
            console.log(row)
            return h( NSpace, {
                justify: "end"
            }, () => [
                h(
                    NButton,
                    {
                        quaternary: true,
                        size: "small"
                    },
                    () => "详情"
                ),
                h(
                    NButton,
                    {
                        quaternary: true,
                        size: "small",
                        onClick: () => {
                            navigateTo("/manage/modify/"+row._id)
                        }
                    },
                    () => "修改"
                )
            ])
        }
    }
]

let columnWidth = 0
column.forEach((e) => {
    columnWidth += e.width
})

const list = ref([])

const pageNumber = ref(1)
const pageSize = ref(10)
const pageCount = ref(1)

const loading = ref(true)

const pageSizes = [5, 10, 15, 20]

const meta = ref({})

function getList(number, size, query) {
    return new Promise((resolve) => {
        $fetch( "/api/get/list", {
            method: "POST",
            query: {
                number: number,
                size: size
            },
            body: query
        }).then((data) => {
            resolve(data)
        })
    })
}

function getMeta() {
    return new Promise((res) => {
        $fetch( "/api/get/meta" ).then((data) => {
            res(data)
        })
    })
}

function refresh() {
    getMeta().then((data) => {
        meta.value.songCount = data.count
        meta.value.tags = data.tags
    })
    
    getList(
        pageNumber.value,
        pageSize.value,
        form.value
    ).then((data) => update(data))
}

function update(data) {
    pageCount.value = data.count
    list.value = data.list
    loading.value = false
}

onMounted( () => {
    refresh()
})

function handlePageChange(v) {
    loading.value = true
    pageNumber.value = v
    getList(
        v,
        pageSize.value,
        form.value
    ).then((data) => update(data))
}

function handlePageSizeChange(v) {
    loading.value = true
    pageSize.value = v
    getList(
        pageNumber.value,
        v,
        form.value
    ).then((data) => update(data))
}

const form = ref({
    tag: []
})

function query() {
    loading.value = true
    getList(
        pageNumber.value,
        pageSize.value,
        form.value
    ).then((data) => update(data))
}

function reset() {
    loading.value = true
    form.value = {
        tag: []
    }
    getList(
        pageNumber.value,
        pageSize.value,
        form.value
    ).then((data) => update(data))
}


function openManagePage() {
    window.open('/manage', '_blank')
}

</script>


<style scoped>
.pagination {
    margin-top: 7px;    
    justify-content: end;
}

.tag-count {
    margin-left: 6px;
    opacity: 0.6;
    font-size: 0.9em;
}
</style>