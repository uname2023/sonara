<template>
    <div class="MVdetail">
        <div class="videoBox">
            <video :src="mvUrl" autoplay controls></video>
        </div>
        <div class="details">
            <div class="mvName">{{ details.mvName }}</div>
            <div class="more">
                <div class="mvAuthor">演唱: <span>{{ details.mvAuthor }}</span></div>
                <div class="playCount">{{ details.playCount }}</div>
                <div class="publishTime">发布时间: {{ details.publishTime }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

let route = useRoute()

let mvId = route.query.id
let coverImg = ref("")
let mvUrl = ref("")
let details = reactive({
    mvName: "",
    mvAuthor: "",
    playCount: 0,
    publishTime: ""
})

requests({ url: `/mv/detail?mvid=${mvId}` }).then(res => {
    coverImg.value = res.data.cover
    details.mvName = res.data.name
    details.mvAuthor = res.data.artistName
    details.playCount = Math.round(parseInt(res.data.playCount) / 1000) / 10 + "万次观看"
    details.publishTime = res.data.publishTime
}, err => {
    console.log(err);
})
requests({ url: `/mv/url?id=${mvId}&r=1080` }).then(res => {
    mvUrl.value = res.data.url
}, err => {
    console.log(err);
})
</script>

<style lang="less" scoped>
.MVdetail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 800px;

    .videoBox {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: black;

        video {
            width: 70%;
        }
    }

    .details {
        width: 100%;
        flex: 1;
        margin-left: 50px;
        margin-top: 10px;

        .mvName {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .more {
            display: flex;
            column-gap: 20px;
            font-size: 16px;
            color: #afaaaa;
        }
    }
}
</style>