<template>
    <el-container>
        <el-aside width="224px">
            <catelogue></catelogue>
        </el-aside>
        <el-container :style="{ color: theme.fontColor, backgroundColor: theme.mainColor }">
            <el-header style="height: 50px;">
                <headerVue></headerVue>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer style="padding: 0;" height="80px">
                <progressBar></progressBar>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script setup>
import headerVue from "@/components/header/index.vue"
import catelogue from "@/components/catelogue/index.vue"
import progressBar from "@/components/progressBar/index.vue"
import { useTheme } from '@/store/theme/index'
import { useRoute, useRouter } from 'vue-router';

let theme = useTheme()
</script>

<style lang="less">
.el-container {
    height: 100%;

    .el-main {
        overflow-y: auto;
    }

    /* 滚动条样式 */
    .el-main::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    /* 滚动条滑块（里面小方块） */
    .el-main::-webkit-scrollbar-thumb {
        border-radius: 10px;
    }

    /* hover时显色 */
    .el-main:hover::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }
}
</style>