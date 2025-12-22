<template>
    <div id="recommend">
        <div class="banner">
            <p class="text1">推荐</p>
            <bannerVue></bannerVue>
        </div>
        <div class="musicList">
            <div class="text2">
                <p>你的专属歌单</p>
                <span class="iconfont icon-jiantouyou"></span>
            </div>
            <div class="content">
                <div class="Musiccard" v-for="(item, index) in musicList" :key="item.id">
                    <div class="imgBox">
                        <div class="masking">
                            <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
                                class="iconfont icon-bofangqi-bofang">
                            </span>
                        </div>
                        <img style="border-radius: 8px;cursor: pointer; min-width: 160px; width: 100%;"
                            :src="item.picUrl" class="image">
                        <div class="playCount">
                            <div class="iconfont icon-erji" style="margin-right: 5px;"></div>
                            <div>{{ Math.round(parseInt(item.playCount) / 1000) / 10 }}万</div>
                        </div>
                    </div>
                    <div style="padding: 5px;">
                        <span style="font-size: 12px;">{{ item.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="newMusic">
            <div class="text2">
                <p>推荐新音乐</p>
                <span class="iconfont icon-jiantouyou"></span>
            </div>
            <div class="content">
                <div class="music" v-for="(item, index) in songList" :key="item.id" @click="songClick(item, index)">
                    <img :src="item.picUrl" style="height: 48px;width: 48px;border-radius: 8px;margin-right: 5px;">
                    <div style="height: 80%; display:flex;flex-direction: column;justify-content: space-between;">
                        <p style="font-size: 12px;">{{ item.name }}</p>
                        <p style="font-size: 12px;color:rgb(148, 163, 184)">{{ item.song.artists[0].name }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="recomMV">
            <MV></MV>
        </div>
    </div>
</template>

<script setup>
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'
import requests from '@/api/request';
import MV from "./MV.vue"
import bannerVue from './banner.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMusic } from '@/store/music';
import { ElMessage } from 'element-plus';
let swiper = ref(null)//存储swiper实例对象
let musicList = ref([])//推荐歌单
let songList = ref([])//推荐歌曲
let router = useRouter()
function toDetails(item, index) {//点击歌单的播放按钮后调转的操作 传入歌单对象
    router.push({
        name: "playList",
        query: {
            id: item.id
        }
    })
}
let music = useMusic()
function songClick(item, index) {//点击歌曲播放操作,传入歌曲对象
    music.addSongsUrl(item.id, index)
    /* 
    将vuex需要的数据包装成一个数组发送过去，避免在请求不同数据的时候，原数据格式不统一导致的获取困难
    */
    let tempArr = []
    let tempObj = {}
    songList.value.forEach(item => {
        tempObj.musicId = item.id
        tempObj.musicName = item.name
        tempObj.musicPic = item.picUrl
        tempObj.musicAuthor = item.song.artists[0].name
        tempArr.push(tempObj)
        tempObj = {}
    })
    music.imgsListAdd(tempArr)
    music.songPlay()
    if (!music.musicState) {
        ElMessage({
            showClose: true,
            message: '460 网路拥挤 请稍后重试',
            type: 'error',
            center: true
        });
    }
}

requests({ url: "/personalized?limit=10" }).then(res => {
    musicList.value = res.result
}, err => {
    console.log(err);
})

requests({ url: "/personalized/newsong" }).then(res => {
    songList.value = res.result
}, err => {
    console.log(err);
})
</script>

<style lang="less" scoped>
#recommend {
    .banner {
        .text1 {
            width: 100%;
            box-sizing: border-box;
            font-weight: 700;
            padding-bottom: 16px;
            font-size: 36px;
            line-height: 36px;
        }


    }

    .musicList {
        .content {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(2, 1fr);
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
                grid-template-rows: repeat(4, 1fr);
                grid-column-gap: 15px;
                grid-row-gap: 15px;
            }
        }
    }

    .newMusic {
        .content {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(5, 1fr);
            grid-column-gap: 15px;
            grid-row-gap: 15px;

            .music {
                display: flex;
                align-items: center;
                cursor: pointer;
            }

            .music:hover {
                background-color: #e5e7eb;
            }
        }
    }

    .text2 {
        height: 52px;
        padding: 12px 0;
        display: flex;
        align-items: center;

        P {
            font-size: 20px;
            line-height: 53px;
        }

    }

}
</style>