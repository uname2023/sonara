<template>
    <div class="playList">
        <div class="informBox">
            <img :src="state ? albumDetail.picUrl : playListObj.imgUrl"
                style="width: 176px;height: 176px;border-radius: 8px;">
            <div class="textTitle">
                <div class="mainTitle">
                    <div style="font-weight: 700;font-size: 24px;">{{ state ? albumDetail.name : playListObj.title }}
                    </div>
                    <div class="more">
                        <div class="author">
                            <span>{{ state ? albumDetail.artist.name : playListObj.author }}</span>
                        </div>
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
                <el-tab-pane :label="'歌曲\t' + musicInforList.length" name="first">
                    <div class="songs ">
                        <ul class="list">
                            <li class="tHead">
                                <div style="flex:2 ;">歌曲</div>
                                <div style="flex:1 ;">歌手</div>
                                <div style="flex:1 ;">时长</div>
                            </li>
                            <li class="tBody" v-for="(item, index) in musicInforList" :key="index"
                                @click="playMusic(item, index)">
                                <div style="flex: 2;"><span class="iconfont icon-shoucang"></span><span>{{ item.name
                                }}</span></div>
                                <div style="flex: 1;">{{ item.author }}</div>
                                <div style="flex: 1 ;">{{ item.duration }}</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="评论" name="second">评论</el-tab-pane>
                <el-tab-pane label="专辑详情" name="third">
                    <div class="descript">
                        {{ albumDetail.description }}
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request'
import { useMusic } from '@/store/music'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let router = useRouter()
let route = useRoute()
let id = route.query.id
let albumDetail = reactive({})//歌单列表
let playListObj = reactive({
    imgUrl: "/imgs/1003.png",
    title: "仿QQ音乐",
    author: "周小建",
    authorImg: "/imgs/1003.png"
})
let activeName = ref("first")
let musicInforList = ref([])//遍历的歌曲数组
let state = ref(false)

let music = useMusic()
function playMusic(item, index) {
    music.addSongsUrl(item.id, index)
    let tempArr = []
    let tempObj = {}
    musicInforList.value.forEach(item => {
        tempObj.musicId = item.id
        tempObj.musicName = item.name
        tempObj.musicPic = null
        tempObj.musicAuthor = item.author
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
onBeforeMount(() => {
    state.value = false
    requests({ url: `/album?id=${id}` }).then(res => {
        console.log(res.album);
        console.log(albumDetail);
        albumDetail = res.album
        console.log(albumDetail);
        res.songs.forEach(item => {
            let temp = {}
            temp.id = item.id
            temp.name = item.name
            temp.author = item.ar[0].name
            let duration = item.dt / 1000
            var end_min = Math.floor(duration / 60)
            end_min = end_min >= 10 ? end_min : ("0" + end_min)
            var end_s = Math.floor(duration % 60)
            end_s = end_s >= 10 ? end_s : ("0" + end_s)
            temp.duration = end_min + ":" + end_s
            musicInforList.value.push(temp)
        });
        state.value = true
    }, err => {
        console.log(err);
    })
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
                    font-size: 13px;

                    .author {
                        display: flex;
                        align-items: center;
                        margin: 20px 0px;
                        column-gap: 10px;
                    }
                }
            }

            .operate {
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

        .descript {
            white-space: pre-wrap;
            font-size: 12px;
            color: rgb(100, 116, 139);
            line-height: 28px;
        }

        ::v-deep .el-tabs {
            height: 100%;
        }

        ::v-deep .el-tabs__content {
            width: 100%;
            height: 100%;
        }

        ::v-deep .el-tab-pane {
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