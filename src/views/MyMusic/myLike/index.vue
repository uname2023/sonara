<template>
    <div class="myLike">
        <div>我的喜欢</div>
        <el-tabs v-show="isLogin" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane :label="'单曲' + SongsCount" name="first">
                <div class="songs ">
                    <ul class="list">
                        <li class="tHead">
                            <div style="flex:2 ;">歌曲</div>
                            <div style="flex:1 ;">专辑</div>
                            <div style="flex:1 ;">时长</div>
                        </li>
                        <li class="tBody" v-for="(item, index) in songList" :key="index"
                            @click="musicPlay(songList, item, index)">
                            <div style="flex: 2;"><span class="iconfont icon-xiai"></span><span>{{ item.name
                            }}</span>
                                <span v-if="item.mv" @click.stop="toMV(item)" class="iconfont icon-MV"
                                    style="color:orange;margin-left: 5px;"></span>
                            </div>
                            <div style="flex: 1;">{{ item.album.name }}</div>
                            <div style="flex: 1 ;">{{ duration(item.duration) }}</div>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="歌单" name="second">
                <SongListVue></SongListVue>
            </el-tab-pane>
        </el-tabs>
        <div v-if="!isLogin">请先登录</div>
    </div>

</template>

<script setup>
import requests from '@/api/request';
import { useLogin } from '@/store/login/login';
import { useMusic } from '@/store/music';
import { onMounted, ref, watch } from 'vue';
import SongListVue from './songLIst.vue';
import { storeToRefs } from 'pinia';
let Login = useLogin()
let { isLogin } = storeToRefs(Login)
const activeName = ref('first')
// 点击标签事件
const handleClick = (tab, event) => {
}
let SongsCount = ref(0)
let songList = ref([])
function load() {
    requests.get("/mylike").then(res => {
        songList.value = res.data.songs
        SongsCount.value = res.data.songs.length
        isLogin.value = true
    }, err => {
        isLogin.value = false
    })
}
function upload() {
    songList.value = []
    SongsCount.value = 0
}
onMounted(() => {
    load()
})
watch(() => isLogin, (n) => {
    if (n) {
        load()
    } else {
        upload()
    }
})
const music = useMusic()
// 点击播放歌曲
function musicPlay(songList, item, index) {
    music.addSongsUrl(item.id, index)
    let tempArr = []
    let tempObj = {}
    songList.forEach(item => {
        tempObj.musicId = item.id
        tempObj.musicName = item.name
        tempObj.musicPic = item.coverImgUrl
        tempObj.musicAuthor = item.artists[0].name
        tempArr.push(tempObj)
        tempObj = {}
    })
    music.imgsListAdd(tempArr)
    music.songPlay()
    if (!musicState.value) {
        ElMessage({
            showClose: true,
            message: '460 网路拥挤 请稍后重试',
            type: 'error',
            center: true
        });
    }
}

// 计算歌曲时长
function duration(dt) {
    let duration = dt / 1000
    var end_min = Math.floor(duration / 60)
    end_min = end_min >= 10 ? end_min : ("0" + end_min)
    var end_s = Math.floor(duration % 60)
    end_s = end_s >= 10 ? end_s : ("0" + end_s)
    return end_min + ":" + end_s
}

</script>

<style lang="less" scoped>
.myLike {
    .songs {
        width: 100%;
        height: 100%;
        overflow: auto;

        ul {
            width: 100%;
            // height: 100%;

            li {
                display: flex;
                align-items: center;
                font-size: 12px;
                padding-top: 20px;
                padding-bottom: 20px;
                padding-left: 4px;
            }

            .iconfont {
                font-size: 12px;
                margin-right: 5px;
            }

            .tBody {
                cursor: pointer;
            }

            .tBody:hover {
                background-color: rgb(229 231 235);
            }

            .tHead {
                color: rgb 163, 175);
            }

        }

        .moreSonger {
            cursor: pointer;
            width: 100%;
            text-align: center;
            padding: 30px 0px;
            color: rgb(52, 211, 153);
        }
    }
}
</style>