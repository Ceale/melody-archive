<script setup>
    const props = defineProps(["error"])
    const error = props.error
    const code = error.statusCode
    const rawMessage = error.message
    const message = ref("")
    if ( code == 404 ) {
        message.value = "该页面不存在"
    } else {
        message.value = "该页面出错了"
    }
</script>


<template>
    <div class="container">
        <div class="content">
            <p class="err">
                {{ message }}
            </p>
            <p class="code">
                {{ code }}
            </p>
            <p class="raw">
                {{ rawMessage }}
            </p>
        </div>
    </div>
</template>


<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    overflow: auto;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    text-align: center;
    white-space: nowrap;
}

.err {
    font-size: 20px;
    font-weight: lighter;
    letter-spacing: 3px;
    margin-bottom: 7px;
}

.code {
    font-weight: bolder;
    letter-spacing: 5px;
    font-size: 14px;
    margin-bottom: 7px;
}

.raw {
    font-size: 10px;
}
</style>