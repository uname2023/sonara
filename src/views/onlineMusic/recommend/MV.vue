<template>
    <div class="mv">
        <div class="text2">
            <p>推荐MV</p>
            <span class="iconfont icon-jiantouyou"></span>
        </div>
        <div class="content">
            <div class="mvBox" v-for="item in mvList" :key="item.id">
                <div class="imgBox">
                    <div class="masking">
                        <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
                            class="iconfont icon-bofangqi-bofang">
                        </span>
                    </div>
                    <img :src="item.picUrl" style="width: 100%;min-width: 160px;border-radius: 8px;">
                    <div class="playCount">
                        <div class="iconfont icon-erji" style="margin-right: 5px;"></div>
                        <div>{{ Math.round(parseInt(item.playCount) / 1000) / 10 }}万</div>
                    </div>
                </div>
                <div style="margin-top: 8px;">
                    <p>{{ item.name }}</p>
                    <p style="color: rgb(148, 163, 184);">{{ item.artistName }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
let mvList = ref([])
let router = useRouter()
function toDetails(item) {
    router.push({
        name: "MVdetail",
        query: {
            id: item.id
        }
    })
}

requests({ url: "/personalized/mv" }).then(res => {
    mvList.value = res.result
}, err => {
    console.log(err);
})
</script>

<style lang="less" scoped>
.mv {
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

    .content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        // grid-template-rows: repeat(2, 1fr);
        grid-column-gap: 15px;
        grid-row-gap: 15px;

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

            img {
                transition-property: all;
                transition-timing-function: cubic-bezier(.4, 0, .2, 1);
                transition-duration: .5s;
                display: flex;
            }

            .masking:hover {
                opacity: 0.5;
                transform: translateY(-5px);
            }

            .masking:hover+img {
                transform: translateY(-5px);
            }
        }

        p {
            font-size: 12px;
        }
    }

    @media (min-width: 0) and (max-width:1040px) {
        .content {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            // grid-template-rows: repeat(4, 1fr);
            grid-column-gap: 15px;
            grid-row-gap: 15px;
        }
    }
}
</style>