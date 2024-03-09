<template>
   <div class="container">
        <div class="content">
            
            <n-config-provider inline-theme-disabled>
            <n-notification-provider>
                <slot />
            </n-notification-provider>
            </n-config-provider>
        
        </div>
   </div>
</template>

<script setup>
useHead({
    title: "旋律档案 Melody Archive"
})
</script>

<style scoped>
.container {
    height: 100vh;
    padding: max(15px, min(20px, 3vw));
    box-sizing: border-box;
    background-color: #f0f0f0;
}

.container .content {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    overflow: auto;
    scrollbar-width: none;
}
.container .content::-webkit-scrollbar {
    width: 0;
}
/* .content :deep(.breadcrumb) {
    margin-top: 5px;
    margin-bottom: 15px;
} */
</style>