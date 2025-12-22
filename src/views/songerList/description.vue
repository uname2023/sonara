<template>
    <div class="description">
        <div class="text" v-for="(item, index) in introduction" :key="index">
            <div class="title">
                {{ item.ti }}
            </div>
            <div class="con">
                {{ item.txt }}
            </div>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request'
import { ref } from 'vue'
let { id } = defineProps(["id"])

let introduction = ref([])
requests({ url: `/artist/desc?id=${id}` }).then(res => {
    introduction.value = res.introduction
}, err => {
    console.log(err);
})
</script>

<style lang="less" scoped>
.description {
    width: 100%;
    height: 100%;
    white-space: pre-wrap;

    .title {
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
        margin: 20px 0px;
    }

    .con {
        font-size: 12px;
        line-height: 28px;
        color: rgb(100, 116, 139);
    }
}
</style>