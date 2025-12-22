<template>
    <div class="radioStation">
        <div class="content">
            <div class="Musiccard" v-for="(item, index) in musicList" :key="item.id">
                <div class="imgBox">
                    <div class="masking">
                        <span @click="toDetails(item, index)" style="color: white;cursor: pointer;"
                            class="iconfont  icon-bofangqi-bofang"></span>
                    </div>
                    <img style="border-radius: 8px;cursor: pointer; min-width: 160px; width: 100%;" :src="item.picUrl"
                        class="image">
                </div>
                <div style="padding: 5px;">
                    <span style="font-size: 12px;">{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

let musicList = ref([])

let router = useRouter()
function toDetails(item, index) {//点击歌单的播放按钮后调转的操作 传入歌单对象
    router.push({
        name: "musicVideo"
    })
}
requests({ url: "/personalized/djprogram" }).then(res => {
    musicList.value = res.result
}, err => {
    console.log(err);
})
</script>

<style lang="less" scoped>
.radioStation {

    .content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(1, 1fr);
        grid-column-gap: 15px;
        grid-row-gap: 15px;
    }

    .imgBox {
        position: relative;

        .playCount {
            position: absolute;
            bottom: 10px;
            padding: 5px;
            right: 10px;
            height: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            background-color: black;
            border-radius: 20px;
            font-size: 12px;
        }

        .masking {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
            transition-property: all;
            transition-timing-function: cubic-bezier(.4, 0, .2, 1);
            transition-duration: .5s;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            background-color: rgb(0 0 0 / 0.5);
            opacity: 0;
            z-index: 10;
        }

        .masking:hover {
            opacity: 0.5;
            transform: translateY(-5px);
        }

        .masking:hover+img {
            transform: translateY(-5px);
        }
    }

    .Musiccard img {
        transition-property: all;
        transition-timing-function: cubic-bezier(.4, 0, .2, 1);
        transition-duration: .5s;
        display: flex;
    }

    @media (min-width: 0) and (max-width:1040px) {
        .content {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 1fr);
            grid-column-gap: 15px;
            grid-row-gap: 15px;
        }
    }
}
</style>