<template>
    <div class="rankingList">
        <div class="official">
            <h3>官方榜</h3>
            <div class="content">
                <div class="ele" v-for="(item, index) in officialLists" :key="index">
                    <div class="img">
                        <div class="masking">
                            <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
                                class="iconfont icon-bofangqi-bofang">
                            </span>
                        </div>
                        <img :src="state ? item.coverImgUrl : ''">
                        <div class="playCount">
                            <div class="iconfont icon-erji" style="margin-right: 5px;"></div>
                            <div>{{ state ? Math.round(parseInt(item.playCount) / 10000000) / 10 : "" }}亿
                            </div>
                        </div>
                    </div>
                    <div class="name">
                        <h3>{{ state ? item.name : '' }}</h3>
                        <div v-for="(item_2, index_2) in state ? item.tracks : 0" :key="index_2">
                            {{ index_2 }}.
                            {{ item_2.first }}
                            {{ item_2.second }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="feature">
            <h3>特色榜</h3>
            <div class="content">
                <div class="Musiccard" v-for="(item, index) in featureLists" :key="index">
                    <div class="imgBox">
                        <div class="masking">
                            <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
                                class="iconfont icon-bofangqi-bofang">
                            </span>
                        </div>
                        <img style="border-radius: 8px;cursor: pointer; min-width: 160px; width: 100%;"
                            :src="item.coverImgUrl" class="image">
                    </div>
                    <div style="padding: 5px;">
                        <span style="font-size: 12px;">{{ item.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
let state = ref(false)
let officialLists = ref([])
let featureLists = ref([])
let router = useRouter()
function toDetails(item, index) {//点击歌单的播放按钮后调转的操作 传入歌单对象
    router.push({
        name: "playList",
        query: {
            id: item.id
        }
    })
}

onBeforeMount(() => {
    state.value = false
    requests({ url: "/toplist/detail" }).then(res => {
        state.value = true
        for (let i = 0; i < res.list.length; i++) {
            if (i <= 3) {
                officialLists.value.push(res.list[i])
            } else {
                featureLists.value.push(res.list[i])
            }
        }
    }, err => {
        console.log(err);
    })
})
</script>

<style lang="less" scoped>
.rankingList {
    width: 100%;
    height: 100%;

    .official {
        width: 100%;
        margin-bottom: 10px;

        h3 {
            margin: 20px 0;
        }

        .content {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            grid-column-gap: 20px;
            grid-row-gap: 20px;

            .ele {
                border-radius: 8px;
                display: flex;

                .img {
                    height: 100%;
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

                    img {
                        width: 140px;
                        height: 100%;
                        border-radius: 8px;
                        transition-property: all;
                        transition-timing-function: cubic-bezier(.4, 0, .2, 1);
                        transition-duration: .5s;
                        display: flex;
                    }
                }

                .name {
                    flex: 1;
                    margin-left: 20px;
                    display: flex;
                    flex-direction: column;

                    h3 {
                        margin: 15px 0px;
                    }

                    div {
                        flex: 1;
                        font-size: 12px;
                    }
                }
            }
        }

        @media (min-width: 0) and (max-width:1040px) {
            .content {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(4, 1fr);
                grid-column-gap: 20px;
                grid-row-gap: 20px;
            }
        }
    }

    .feature {
        h3 {
            margin: 20px 0;
        }

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

}
</style>