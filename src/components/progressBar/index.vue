<template>
    <div style="min-width: 600px;">
        <div class="content">
            <div class="player-slider">
                <el-slider v-model="currentTime" :max="duration" @mousedown="sliderFlag = false"
                    @mouseup="sliderFlag = true" @change="change" style="height: 10px;"
                    :show-tooltip="false"></el-slider>
            </div>
            <div class="player">
                <div class="intro">
                    <div class="pic" @click="openDrawer">
                        <img :src="imgUrl">
                        <div class="lyrics"><span class="iconfont icon-zhankai"></span></div>
                    </div>
                    <div class="m1">
                        <div class="name">{{ imgName }}<span>-{{ imgMaster }}</span></div>
                        <div class="icon">
                            <div class="iconfont icon-shoucang"></div>
                            <div class="iconfont icon-xiazai-wenjianxiazai-05"></div>
                            <div class="iconfont icon-more-br"></div>
                            <div class="iconfont icon-review"></div>
                        </div>
                    </div>
                </div>
                <div class="operate">
                    <div :class="playFun" @click="playFunc" class="iconfont" style="margin:5px;font-size: 20px;"></div>
                    <div @click="lastOne" class="iconfont icon-shangyishou" style="margin:5px;font-size: 28px;"></div>
                    <!-- icon-zanting1 -->
                    <div @click="play" :class="fonticon" class="iconfont"
                        style="margin:5px;font-size: 45px;color: #34d399;">
                    </div>
                    <div @click="nextOne" class="iconfont icon-xiayishou" style="margin:5px;font-size: 28px;"></div>
                    <el-popover popper-class="popperClass" ref="popoverRef" :virtual-ref="yingliangRef" placement="top"
                        width="80" trigger="hover" virtual-triggering>
                        <el-slider @change="soundChange" tooltip-class="slider" v-model="sound" vertical height="100px">
                        </el-slider>
                        <div class="iconfont icon-yangshengqi" style="margin:5px;font-size: 15px;"></div>
                    </el-popover>
                    <div ref="yingliangRef" class="iconfont icon-yinliang" style="margin:5px;font-size: 20px;">
                    </div>
                </div>
                <div class="status">
                    <div class="time">{{ curTime || "00:00" }} / {{ endTime || "00:00" }}</div>
                    <div class="songList">
                        <el-drawer modal-class="drawerClass" :with-header="false" v-model="drawer" size="320px">
                            <div class="drawerBox">
                                <div class="drawTitle">播放列表</div>
                                <div class="drawCount"><span>共{{ imgsList.length }}首歌曲</span><span
                                        style="cursor: pointer;" @click="clear">清空</span></div>
                                <div :class="{ currentMusic: currentSongId == index }" class="drawList"
                                    v-for="(item, index) in imgsList" :key="index">
                                    <div>
                                        <img :src="item.musicPic" style="width: 40px;height: 40px;border-radius: 8px;">
                                        <div>
                                            <p>{{ item.musicName }}</p>
                                            <p>{{ item.musicAuthor }}</p>
                                        </div>
                                    </div>
                                    <div class="drawTime" v-if="currentSongId == index">{{ endTime }}</div>
                                </div>
                            </div>
                        </el-drawer>
                        <div @click="drawer = true" class="iconfont icon-gedan" style="font-size: 28px;"></div>
                    </div>
                </div>
            </div>
            <audio ref="audio" :src="SongUrl || ''" @canplay="canplay" @timeupdate="timeupdate"
                @durationchange="durationchange" @ended="ended"></audio>
        </div>
    </div>
    <el-drawer v-model="lyricsDrawer" direction="btt" size="100%" :with-header=false body-class="lyricsBody">
        <div class="lyrics" :style="{ color: theme.fontColor, backgroundColor: theme.catelogueColor }">
            <div class="header">
                <div class="iconfont icon-xiangxiajiantou" @click="closeLyrics"></div>
            </div>
            <div class="content"></div>
            <div class="progressBar">
                <div class="player-slider">
                    <el-slider v-model="currentTime" :max="duration" @mousedown="sliderFlag = false"
                        @mouseup="sliderFlag = true" @change="change" style="height: 10px;"
                        :show-tooltip="false"></el-slider>
                </div>
                <div class="player">
                    <div class="info">a</div>
                    <div class="operate">
                        <div :class="playFun" @click="playFunc" class="iconfont" style="margin:5px;font-size: 20px;">
                        </div>
                        <div @click="lastOne" class="iconfont icon-shangyishou" style="margin:5px;font-size: 28px;">
                        </div>
                        <!-- icon-zanting1 -->
                        <div @click="play" :class="fonticon" class="iconfont"
                            style="margin:5px;font-size: 45px;color: #34d399;">
                        </div>
                        <div @click="nextOne" class="iconfont icon-xiayishou" style="margin:5px;font-size: 28px;"></div>
                        <el-popover popper-class="popperClass" ref="popoverRef2" :virtual-ref="yingliangRef2"
                            placement="top" width="80" trigger="hover" virtual-triggering>
                            <el-slider @change="soundChange" tooltip-class="slider" v-model="sound" vertical
                                height="100px">
                            </el-slider>
                            <div class="iconfont icon-yangshengqi" style="margin:5px;font-size: 15px;"></div>
                        </el-popover>
                        <div ref="yingliangRef2" class="iconfont icon-yinliang" style="margin:5px;font-size: 20px;">
                        </div>
                    </div>
                    <div class="status">
                        <div class="time">{{ curTime || "00:00" }} / {{ endTime || "00:00" }}</div>
                        <div class="songList">
                            <div @click="drawer = true" class="iconfont icon-gedan" style="font-size: 28px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup>
import "@/assets/icon.css";
import { useMusic } from "@/store/music";
import { useTheme } from "@/store/theme";
import { ElMessage } from "element-plus";
import { tr } from "element-plus/es/locales.mjs";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import lyricsVue from "./lyrics.vue";
// #region
let totalDuration = ref(100)
let musicSize = ref(0)
let fonticon = ref("icon-bofang1")
let currentTime = ref(0)
let duration = ref(0)
let sliderFlag = ref(true)
let playFun = ref("icon-shunxubofang")//设置播放类型
let isXunhuan = ref(true)
let sound = ref(100)
let drawer = ref(false)
let currentMusic = ref("currentMusic")

let music = useMusic()
let { SongUrl, currentSongId, imgsList, paused, musicState } = storeToRefs(music)
let audio = ref(null);
let yingliangRef = ref(null)
let popoverRef = ref(null)


let soundPercent = computed({
    get() {
        return Math.round(sound.value / 10) / 10
    }
})

let imgUrl = computed({
    get() {
        if (imgsList.value.length) {
            return imgsList.value[currentSongId.value].musicPic || "imgs/1003.png"
        } else {
            return "imgs/1003.png"
        }
    }
})
let imgName = computed({
    get() {
        if (imgsList.value.length) {
            return imgsList.value[currentSongId.value].musicName || "仿QQ音乐"
        } else {
            return "仿QQ音乐"
        }
    }
})
let imgMaster = computed({
    get() {
        if (imgsList.value.length) {
            return imgsList.value[currentSongId.value].musicAuthor || "周小建"
        } else {
            return "周小建"
        }
    }
})
let curTime = computed({
    get() {
        var start_min = Math.floor(currentTime.value / 60);
        start_min = start_min >= 10 ? start_min : ("0" + start_min)
        var start_s = Math.floor(currentTime.value % 60)
        start_s = start_s >= 10 ? start_s : ("0" + start_s)
        return start_min + ":" + start_s
    }
})
let endTime = computed({
    get() {
        var end_min = Math.floor(duration.value / 60)
        end_min = end_min >= 10 ? end_min : ("0" + end_min)
        var end_s = Math.floor(duration.value % 60)
        end_s = end_s >= 10 ? end_s : ("0" + end_s)
        return end_min + ":" + end_s
    }
})



// 清空播放列表
/*
清除歌曲url
清楚 
 */
function clear() {
    audio.value.pause() // 音乐播放暂停
    music.songPause() //音乐状态暂停
    music.clear() //清空全局数据
    duration.value = 0 // 时长
    fonticon.value = "icon-bofang1" // 播放按钮恢复暂停
}


function play() {
    if (audio.value.paused && audio.value.readyState == 4) {
        fonticon.value = "icon-zanting1"
        audio.value.play()
        music.songPlay()
    } else {
        audio.value.pause()
        fonticon.value = "icon-bofang1"
        music.songPause()
    }
}
function playFunc() {
    if (playFun.value == "icon-danquxunhuan") {
        playFun.value = "icon-shunxubofang"
        isXunhuan.value = false
    } else if (playFun.value == "icon-shunxubofang") {
        playFun.value = "icon-24gl-shuffle"
    } else {
        playFun.value = "icon-danquxunhuan"
        isXunhuan.value = true
    }
}
function soundChange() {
    audio.value.volume = soundPercent
}
function ended() {
    if (isXunhuan.value) {
        play()
    } else {
        nextOne()
    }
}
function canplay() {
    duration.value = audio.value.duration
}
function timeupdate() {
    if (sliderFlag.value) {
        currentTime.value = audio.value.currentTime
    }
}
function change() {
    audio.value.currentTime = currentTime.value
}
function durationchange() {
    fonticon.value = "icon-zanting1"
    audio.value.play()
    music.songPlay()
}
function lastOne() {
    let msg = music.lastOne()
    if (msg) {
        ElMessage({
            showClose: true,
            message: msg,
            type: 'error',
            center: true,
        });
    }
}
function nextOne() {
    let msg = music.nextOne()
    if (msg) {
        ElMessage({
            showClose: true,
            message: msg,
            type: 'error',
            center: true,
        });
    }
}

let lyricsDrawer = ref(false)
let musicId = ref(null)
// 控制歌词界面展开
// 给musicId一个初始值方便子组件监听
function openDrawer() {
    lyricsDrawer.value = true
    /*  if (imgsList.value.length) {
         musicId.value = imgsList.value[currentSongId.value].musicId
         lyricsDrawer.value = true
     } else {
         ElMessage({
             showClose: true,
             message: "暂无歌曲播放",
             type: 'error',
             center: true,
         });
     } */
}
// #endregion


let theme = useTheme()
let popoverRef2 = ref(null)
let yingliangRef2 = ref(null)
function closeLyrics() {
    lyricsDrawer.value = false
}





</script>

<style lang="less" scoped>
.content {
    .player-slider {
        margin: 5px;
        height: 10px;

        :deep(.el-slider__runway) {
            margin: 0;
            background-color: #e4e7ed;
        }

        :deep(.el-slider__button) {
            width: 8px;
            height: 8px;
            border: 2px solid #34d399;
            background-color: #34d399;
        }

        :deep(.el-slider__bar) {
            height: 3px;
            background-color: #34d399;
        }

        :deep(.el-slider__runway) {
            height: 3px;
        }

        :deep(.el-slider__button-wrapper) {
            position: absolute;
            top: -12.5px;
            width: 10px;
            height: 10px;
            opacity: 0;
            transition-property: opacity;
            transition-timing-function: cubic-bezier(.4, 0, .2, 1);
            transition-duration: .15s;
        }

        :deep(.el-slider__runway) {
            &:hover {
                .el-slider__button-wrapper {
                    opacity: 1;
                }
            }
        }
    }

    .player {
        width: 100%;
        padding-left: 10px;
        padding-right: 5px;
        display: flex;
        align-items: center;

        .intro {
            flex: 1;
            height: 44px;
            display: flex;
            justify-content: start;
            align-items: center;

            .pic {
                width: 44px;
                height: 44px;
                margin: 10px;
                border-radius: 8px;
                overflow: hidden;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                }

                .lyrics {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;

                    &:hover {
                        opacity: 1;
                        background-color: rgba(0, 0, 0, 0.5);
                        cursor: pointer;

                        .iconfont {
                            color: rgb(52 211 153);
                        }
                    }
                }

            }

            .m1 {
                width: 208px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: start;
                overflow: hidden;

                .name {
                    font-size: 12px;

                    span {
                        display: inline-block;
                        margin-left: 5px;
                        color: rgb(148, 163, 184);
                    }
                }

                .icon {
                    width: 100%;
                    height: 18px;
                    cursor: pointer;
                    display: flex;
                    color: rgb(51, 65, 85);

                    .iconfont {
                        color: rgb(148, 163, 184);
                        margin-right: 10px;
                        font-size: 18px !important;
                    }
                }
            }
        }

        .operate {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;


        }

        .status {
            height: 100%;
            flex: 1;
            display: flex;
            justify-content: end;
            align-items: center;

            .time {
                color: rgb(51, 65, 85);
                font-size: 12px;
            }

            .songList {
                padding-right: 10px;
                padding-left: 10px;
            }
        }

        .iconfont:hover {
            cursor: pointer;
            color: rgb(52 211 153);
        }
    }
}

.lyrics {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .header {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: rgb(149, 149, 225);

        .iconfont {
            color: black;

            &:hover {
                color: rgb(52 211 153);
            }
        }
    }

    .content {
        flex: 1;
        background-color: skyblue;
    }

    .progressBar {
        // height: 60px;
        width: 100%;
        // background-color: rgba(37, 59, 62, .8);

        .player-slider {
            // margin: 5px;
            height: 10px;

            :deep(.el-slider__runway) {
                margin: 0;
                background-color: #e4e7ed;
            }

            :deep(.el-slider__button) {
                width: 8px;
                height: 8px;
                border: 2px solid #34d399;
                background-color: #34d399;
            }

            :deep(.el-slider__bar) {
                height: 3px;
                background-color: #34d399;
            }

            :deep(.el-slider__runway) {
                height: 3px;
            }

            :deep(.el-slider__button-wrapper) {
                position: absolute;
                top: -12.5px;
                width: 10px;
                height: 10px;
                opacity: 0;
                transition-property: opacity;
                transition-timing-function: cubic-bezier(.4, 0, .2, 1);
                transition-duration: .15s;
            }

            :deep(.el-slider__runway) {
                &:hover {
                    .el-slider__button-wrapper {
                        opacity: 1;
                    }
                }
            }
        }

        .player {
            width: 100%;
            height: 100%;
            padding-left: 10px;
            padding-right: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .intro {
                flex: 1;
                height: 44px;
                display: flex;
                justify-content: start;
                align-items: center;

                .pic {
                    width: 44px;
                    height: 44px;
                    margin: 10px;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;

                    img {
                        width: 100%;
                        height: 100%;
                    }

                    .lyrics {
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        opacity: 0;

                        &:hover {
                            opacity: 1;
                            background-color: rgba(0, 0, 0, 0.5);
                            cursor: pointer;

                            .iconfont {
                                color: rgb(52 211 153);
                            }
                        }
                    }

                }

                .m1 {
                    width: 208px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: start;
                    overflow: hidden;

                    .name {
                        font-size: 12px;

                        span {
                            display: inline-block;
                            margin-left: 5px;
                            color: rgb(148, 163, 184);
                        }
                    }

                    .icon {
                        width: 100%;
                        height: 18px;
                        cursor: pointer;
                        display: flex;
                        color: rgb(51, 65, 85);

                        .iconfont {
                            color: rgb(148, 163, 184);
                            margin-right: 10px;
                            font-size: 18px !important;
                        }
                    }
                }
            }

            .operate {
                flex: 1;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }

            .status {
                height: 100%;
                flex: 1;
                display: flex;
                justify-content: end;
                align-items: center;

                .time {
                    color: rgb(51, 65, 85);
                    font-size: 12px;
                }

                .songList {
                    padding-right: 10px;
                    padding-left: 10px;
                }
            }

            .iconfont:hover {
                cursor: pointer;
                color: rgb(52 211 153);
            }
        }
    }
}
</style>


<style lang="less">
.popperClass {
    box-sizing: border-box;
    padding: 20px !important;
    display: flex;
    grid-gap: 5px;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    min-width: 80px !important;
}

.drawerClass {

    .drawTitle {
        height: 28px;
        color: rgb(51, 65, 85);
        font-size: 20px;
        line-height: 28px;
        margin: 10px;
    }

    .drawCount {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 10px;
        color: rgb(51, 65, 85);
        font-size: 12px;
    }

    .currentMusic {
        color: rgb(52, 211, 153) !important;
        border-left: 2px solid rgb(52, 211, 153);
    }

    .drawList {
        width: 100%;
        height: 40px;
        color: black;

        padding: 10px;
        margin: 10px 0px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        & div:nth-child(1) {
            display: flex;
            align-items: center;

            div {
                font-size: 12px;
                margin-left: 8px;
                display: flex;
                height: 35px;
                flex-direction: column;
                justify-content: space-between;
                align-items: start;
            }
        }

        .drawTime {
            font-size: 10px;
        }
    }
}

.lyricsBody {
    padding: 0px;
}
</style>