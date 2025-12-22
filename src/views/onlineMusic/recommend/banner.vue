<template>
    <div class="banshi">
        <div class="swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in bannerList" :key="item.id">
                    <img :src="item.imageUrl" @click="bannerSong(item)">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'
// 导入并注册模块
import { Autoplay } from 'swiper/modules';//加载自动播放组件
Swiper.use([Autoplay]);

import { onUpdated, ref } from 'vue';
let bannerList = ref([])

function bannerSong(item) {
    console.log(item);
}
requests({ url: "/banner" }).then(res => {
    bannerList.value = res.banners
}, err => {
    console.log(err);
})
onUpdated(() => {
    new Swiper(".swiper", {
        loop: true, // 无缝
        autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: true,
        },//自动播放
        breakpoints: {
            //当宽度大于等于0
            0: {
                slidesPerView: 1,
                spaceBetween: 30
            },
            //当宽度大于等于780
            1040: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            //当宽度大于等于1030
            1280: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            10000: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        },

    })
})
</script>

<style lang="less" scoped>
.banshi {
    cursor: grab;

    .swiper-wrapper {
        width: 100%;
        height: 100%;

        .swiper-slide {
            position: relative;
            // height: 155.55px;
            width: 33.33%;
            background-repeat: no-repeat;
            background-size: contain;
            background-color: #F7F8FA;

            img {
                max-width: 100%;
                border-radius: 8px;
                height: auto;
                cursor: pointer;
            }
        }
    }
}
</style>