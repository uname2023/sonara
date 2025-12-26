<template>
    <div class="playList">
        <div class="informBox">
            <img :src="playListObj.imgUrl" style="width: 176px;height: 176px;border-radius: 8px;">
            <div class="textTitle">
                <div class="mainTitle">
                    <div style="font-weight: 700;font-size: 24px;">{{ playListObj.title }}</div>
                    <div class="more">
                        <div class="aAt">
                            <div class="author">
                                <img :src="playListObj.authorImg" style="width: 24px;height: 24px;border-radius: 50%;">
                                <span>{{ playListObj.author }}</span>
                            </div>
                            <div>
                                <span v-for="(item, index) in playListObj.tags" :key="index">
                                    #{{ item }}
                                </span>
                            </div>
                        </div>
                        <div class="descrip">{{ playListObj.description }}</div>
                    </div>
                </div>
                <div class="operate">
                    <button style="background-color: rgb(5, 150, 105);color: white;width: 128px;">
                        <span style="margin-right: 4px;" class="iconfont icon-24gl-play"></span>
                        <span>播放全部</span>
                    </button>
                    <button style="width: 128px;">
                        <span style="margin-right: 4px;" class="iconfont icon-shoucang"></span>
                        <span>收藏</span>
                    </button>
                    <button style="width: 32px;">
                        <span class="iconfont icon-gengduo"></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="songBox">
            <el-tabs v-model="activeName">
                <el-tab-pane :label="'歌曲' + songsNum" name="first">
                    <div class="songs ">
                        <el-scrollbar height="300" @end-reached="load">
                            <ul class="list">
                                <li class="tHead">
                                    <div style="flex:2 ;">歌曲</div>
                                    <div style="flex:1 ;">歌手</div>
                                    <div style="flex:1 ;">专辑</div>
                                    <div style="flex:1 ;">时长</div>
                                </li>
                                <li class="tBody" v-for="(item, index) in musicInforList" :key="index"
                                    @click="playMusic(item, index)">
                                    <div style="flex: 2;"><span class="iconfont icon-shoucang"></span><span>{{ item.name
                                    }}</span></div>
                                    <div style="flex: 1;">{{ item.author }}</div>
                                    <div style="flex: 1;">{{ item.album }}</div>
                                    <div style="flex: 1 ;">{{ item.duration }}</div>
                                </li>
                            </ul>
                        </el-scrollbar>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="评论" name="second">评论</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request'
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMusic } from "@/store/music/index"
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';

let route = useRoute()
let id = route.query.id
let playLists = ref([])//歌单列表
let playListObj = reactive({
    imgUrl: "/imgs/1003.png",
    title: "sonara",
    author: "周小建",
    authorImg: "/imgs/1003.png",
    tags: ["怀旧", "流行"],
    description: "哈哈哈"
})
let activeName = ref("first")
let loading = ref(false)
let offset = 0//从哪一首歌曲开始请求
let songsNum = ref(0)
let musicInforList = ref([])//遍历的歌曲数组
let musicUrlList = ref([])

function load() {
    loading.value = true
    requests.get(`/playlist/${id}`).then(res => {
        console.log(res);
        playLists.value = playLists.value.concat(res.songs)
        res.songs.forEach(item => {
            let temp = {}
            temp.id = item.id
            temp.name = item.name
            temp.author = item.al.name
            temp.album = item.ar[0].name
            let duration = item.dt / 1000
            var end_min = Math.floor(duration / 60)
            end_min = end_min >= 10 ? end_min : ("0" + end_min)
            var end_s = Math.floor(duration % 60)
            end_s = end_s >= 10 ? end_s : ("0" + end_s)
            temp.duration = end_min + ":" + end_s
            musicInforList.value.push(temp)
        });
        offset += 10;
        loading.value = false
    }, err => {
        console.log(err);
    })
}

load()

let music = useMusic()
function playMusic(item, index) {
    music.addSongsUrl(item.id, index)
    let tempArr = []
    let tempObj = {}
    playLists.value.forEach(item => {
        tempObj.musicId = item.id
        tempObj.musicName = item.name
        tempObj.musicPic = item.al.picUrl
        tempObj.musicAuthor = item.al.name
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

requests({ url: `/playlist/detail?id=${id}` }).then(res => {
    songsNum.value = res.privileges.length
    playListObj.imgUrl = res.playlist.coverImgUrl
    playListObj.title = res.playlist.name
    playListObj.author = res.playlist.creator.nickname
    playListObj.authorImg = res.playlist.creator.avatarUrl
    playListObj.tags = res.playlist.tags
    playListObj.description = res.playlist.description
}, err => {
    console.log(err);
})

</script>

<style lang="less" scoped>
.playList {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .informBox {
        position: relative;
        display: flex;
        width: 100%;
        align-items: stretch;

        .iconfont {
            font-size: 14px;
        }

        .textTitle {
            padding: 4px 0px 4px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: start;

            .mainTitle {
                .more {
                    font-size: 12px;

                    .aAt {
                        display: flex;
                        align-items: center;
                        column-gap: 45px;
                        color: rgb(148, 163, 184);
                        padding: 12px 0px 8px 0px;

                        .author {
                            display: flex;
                            align-items: center;
                            column-gap: 10px;
                        }
                    }

                    .descrip {
                        color: rgb(107, 114, 128);
                    }
                }
            }

            .operate {
                margin-top: 20px;
                display: flex;
                column-gap: 8px;

                button {
                    height: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 999px;
                    border: 1px solid;
                    border-color: rgb(229, 231, 235);
                    font-size: 14px;
                    line-height: 20px;
                }

                button:hover {
                    border-color: rgb(16 185 129);
                    color: rgb(16 185 129);
                }
            }
        }

    }

    .songBox {
        flex: 1;

        :deep(.el-tabs) {
            height: 100%;
        }

        :deep(.el-tabs__content) {
            width: 100%;
            height: 100%;
        }

        :deep(.el-tab-pane) {
            width: 100%;
            height: 100%;
        }

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
                    color: rgb(156, 163, 175);
                }

            }
        }
    }
}
</style>