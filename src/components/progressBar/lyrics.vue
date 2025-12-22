<template>
    
</template>
<script setup>
import { useTheme } from "@/store/theme";



</script>
<!-- <script lang="ts" setup>
import { useMusic } from "@/store/music"
import { storeToRefs } from "pinia";
import requests from "@/api/request"
import { computed, watch } from "vue";
const { musicId } = defineProps(["musicId"])
watch(() => musicId, (newValue, oldValue) => {
    loadLyrics()
})

function loadLyrics() {
    requests(`/lyric?id=${musicId}`).then(
        res => {
            console.log(res)
        },
        err => {
            console.log(err)
        }
    )
}
loadLyrics()


/* 
音乐图片
名字
作者
vip标识
喜欢人数
评论人数


*/
</script>
 -->
<style lang="less" scoped>

</style>