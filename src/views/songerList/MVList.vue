<template>
    <div class="mv">
        <div class="content">
            <div class="mvBox" v-for="item in mvList" :key="item.id">
                <div class="imgBox">
                    <div class="masking">
                        <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
                            class="iconfont icon-bofangqi-bofang">
                        </span>
                    </div>
                    <img :src="item.imgurl" style="width: 100%;min-width: 160px;border-radius: 8px;">
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
        <p class="moreSonger" @click="addMVList">加载更多</p>
    </div>
</template>

<script setup>
import requests from '@/api/request';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
let mvList = ref([])
let offset = 40
let { id } = defineProps(["id"])
let router = useRouter()
function toDetails(item) {
    router.push({
        name: "MVdetail",
        query: {
            id: item.id
        }
    })
}

function addMVList() {
    requests({ url: `/artist/mv?id=${id}&limit=40&offset=${offset}` }).then(res => {
        mvList.value = mvList.value.concat(res.mvs)
        offset += 40
    }, err => {
        console.log(err);
        ElMessage({
            showClose: true,
            message: '没有更多了',
            type: 'error',
            center: true
        });
    })
}

requests({ url: `/artist/mv?id=${id}&limit=40&offset=0` }).then(res => {
    mvList.value = res.mvs
}, err => {
    console.log(err);
})

</script>

<style lang="less" scoped>
.mv {
    margin-top: 20px;

    .moreSonger {
        cursor: pointer;
        width: 100%;
        text-align: center;
        padding: 30px 0px;
        color: rgb(52, 211, 153);
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
            grid-column-gap: 15px;
            grid-row-gap: 15px;
        }
    }
}
</style>