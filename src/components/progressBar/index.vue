<template>
    <div style="min-width: 600px;">
        <div class="content">
            <div class="player-slider">
                <el-slider v-model="currentTime" :max="duration" @mousedown="sliderFlag = false"
                    @mouseup="sliderFlag = true" @change="change" style="height: 10px;"></el-slider>
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
                @durationchange="durationchange" @ended="ended" crossorigin="anonymous"></audio>
        </div>
    </div>
    <el-drawer :open="open" v-model="lyricsDrawer" :modal="true" direction="btt" size="100%" :with-header=false
        body-class="lyricsBody">
        <div class="lyrics" :style="{ color: theme.fontColor, backgroundColor: theme.catelogueColor }">
            <div class="header">
                <div class="iconfont icon-xiangxiajiantou" @click="closeLyrics"></div>
                <i :class="themeicon" class="iconfont" @click="changeTheme"></i>
            </div>
            <div class="content" :style="{ color: theme.fontColor, backgroundColor: theme.catelogueColor }">
                <div class="card">
                    <div class="photo">
                        <!-- 多层光环 -->
                        <div class="halo-layer halo-outer"></div>
                        <div class="halo-layer halo-middle"></div>
                        <div class="halo-layer halo-inner"></div>

                        <!-- 动态光点 -->
                        <div class="light-points" ref="lightPoints">
                            <div v-for="i in 12" :key="i" class="light-point" :style="getLightPointStyle(i)"></div>
                        </div>

                        <!-- 唱片 -->
                        <div class="vinyl" :class="{ playing: isPlaying }">
                            <!-- 唱片标签 -->
                            <div class="vinyl-label">
                                <div class="label-content">
                                    <img :src="imgUrl">
                                </div>
                            </div>

                            <!-- 唱片纹理 -->
                            <div class="vinyl-texture"></div>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="title">
                        <div class="h1">{{ imgName }}</div>
                        <div class="songer">{{ imgMaster }}</div>
                    </div>
                    <div class="lyrics-wrapper" ref="lyricsWrapper" @scroll="handleLyricsScroll">
                        <div class="lyricLineBox">
                            <div :ref="(el) => { if (el) lyricRefs[index] = el }" v-for="(line, index) in parsedLyrics"
                                :key="index" class="lyric-line" :data-time="line.time" @click="seekToLyric(line.time)"
                                :class="{
                                    'active': index === currentLyricIndex,
                                    'passed': index < currentLyricIndex
                                }">
                                {{ line.text }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="progressBar">
                <div class="canvas" ref="canvasContainer">
                    <!-- Canvas绘制区域 -->
                    <canvas ref="visualizerCanvas" class="visualizer-canvas" :width="canvasWidth"
                        :height="canvasHeight"></canvas>
                </div>
                <div class="player-slider">
                    <el-slider v-model="currentTime" :max="duration" @mousedown="sliderFlag = false"
                        @mouseup="sliderFlag = true" @change="change" style="height: 10px;"></el-slider>
                </div>
                <div class="player">
                    <div class="info">
                        <i class="iconfont icon-xiangxiajiantou" @click="closeLyrics"></i>
                    </div>
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
import requests from "@/api/request";
import "@/assets/icon.css";
import { useMusic } from "@/store/music";
import { useTheme } from "@/store/theme";
import { ElMessage, linkProps } from "element-plus";
import { el, tr } from "element-plus/es/locales.mjs";
import { storeToRefs } from "pinia";
import { computed, h, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

// #region
let totalDuration = ref(100)
let musicSize = ref(0)
let fonticon = ref("icon-bofang1")
let currentTime = ref(0)
let duration = ref(0)
let sliderFlag = ref(true)
let playFun = ref("icon-shunxubofang")//设置播放类型
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
            return imgsList.value[currentSongId.value].musicName || "sonara"
        } else {
            return "sonara"
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
    if (audio.value.paused && audio.value.readyState == 4 && audio.value) {
        fonticon.value = "icon-zanting1"

        // 恢复音频上下文（如果被暂停）
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

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
    } else if (playFun.value == "icon-shunxubofang") {
        playFun.value = "icon-24gl-shuffle"
    } else {
        playFun.value = "icon-danquxunhuan"
    }
}
function soundChange() {
    audio.value.volume = soundPercent.value
}
function ended() {
    if (playFun.value == "icon-danquxunhuan") {//单曲循环
        play()
    }
    if (playFun.value == "icon-shunxubofang") {//顺序播放
        nextOne()
    }
    if (playFun.value == "icon-24gl-shuffle") {//随机播放
        let index = Math.floor(Math.random() * (imgsList.value.length + 1))
        currentSongId.value = index;
        music.addSongsUrl(imgsList.value[currentSongId.value].musicId, currentSongId.value)
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
let musicId = computed({
    get() {
        if (imgsList.value.length) {
            return imgsList.value[currentSongId.value].musicId
        } else {
            return null
        }
    }
})
// 控制歌词界面展开
// 给musicId一个初始值方便子组件监听
function openDrawer() {
    if (imgsList.value.length) {
        lyricsDrawer.value = true
    } else {
        ElMessage({
            showClose: true,
            message: "暂无歌曲播放",
            type: 'error',
            center: true,
        });
    }
}
// #endregion
let theme = useTheme()
let popoverRef2 = ref(null)
let yingliangRef2 = ref(null)
function closeLyrics() {
    lyricsDrawer.value = false
}
let themeicon = ref("icon-taiyang")//icon-taiyang,icon-moon
function changeTheme() {
    themeicon.value = themeicon.value == "icon-taiyang" ? "icon-moon" : "icon-taiyang"
    theme.changeTheme()
}




//监听当前歌曲的id，切换歌曲并且打开歌词面板时更新歌词
let lyricData = ref("") //歌词原始数据
let lyricsWrapper = ref(null) //展示歌词容器
const scrollTimeout = ref(null); // 滚动超时定时器
let lyricRefs = ref([]) //歌词行
watch(() => musicId.value, (n) => {
    // /song/{id}/lyrics
    requests(`/song/${n}/lyrics`).then(
        res => {
            console.log(res);
            lyricData.value = res.data.lyrics;
        },
        err => {
            console.log(err)
        }
    )
})


function open() {
    console.log("aa");
}

// 将服务器的歌词模板转为对象
let parsedLyrics = computed(() => {
    const lines = lyricData.value.split('\n');
    const result = []
    lines.forEach(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/)
        if (match) {
            const minutes = parseInt(match[1])
            const seconds = parseFloat(match[2])
            const time = minutes * 60 + seconds
            const text = match[3].trim()
            if (!(text == null || text == "")) {
                result.push({ time, text })
            }
        }
    })
    return result
})


//歌词滚动实现

let isUserScrolling = ref(false)//判断用户是否在滚动
const currentLyricIndex = ref(0); // 当前歌词索引

// 监听播放时间变化，更新当前歌词
watch(currentTime, (newTime) => {
    if (isUserScrolling.value || !lyricsDrawer.value) return; // 用户正在滚动时不更新
    const newIndex = findCurrentLyricIndex(newTime, parsedLyrics.value);
    if (newIndex !== currentLyricIndex.value) {
        currentLyricIndex.value = newIndex;
        // 滚动到当前歌词
        scrollToCurrentLyric();
    }
});

/**
 * 找到当前时间对应的歌词索引
 */
function findCurrentLyricIndex(currentTimeMs, lyrics) {
    // 使用二分查找提高性能
    let left = 0;
    let right = lyrics.length - 1;
    let result = 0;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (lyrics[mid].time <= currentTimeMs) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}


/**
 * 滚动到当前歌词
 */
function scrollToCurrentLyric() {
    if (!lyricsWrapper.value) return;
    nextTick(() => {
        // 等待DOM更新
        const currentElement = lyricRefs.value[currentLyricIndex.value];
        if (!currentElement) return;
        const container = lyricsWrapper.value;
        const containerHeight = container.clientHeight;
        const elementTop = currentElement.offsetTop;
        const elementHeight = currentElement.offsetHeight;

        // 计算滚动位置：将当前歌词行滚动到容器中间
        const targetScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);

        // 当前滚动位置
        const currentScrollTop = container.scrollTop;

        // 计算滚动距离
        container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    })
}

/**
 * 处理用户滚动歌词
 */
function handleLyricsScroll() {
    // 标记用户正在手动滚动
    isUserScrolling.value = true;

    // 清除之前的定时器
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
    }

    // 设置定时器，用户停止滚动一段时间后恢复自动跟随
    scrollTimeout.value = setTimeout(() => {
        isUserScrolling.value = false;

        // 重新计算当前歌词索引
        const currentTime2 = currentTime.value;
        const newIndex = findCurrentLyricIndex(currentTime2, parsedLyrics.value);
        currentLyricIndex.value = newIndex;

        // 滚动到正确位置
        scrollToCurrentLyric();
    }, 3000); // 3秒后恢复自动跟随
}


// 点击歌词跳转到对应时间
function seekToLyric(time) {
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value);
    }
    currentTime.value = time
    audio.value.currentTime = time
    scrollToCurrentLyric()
}

//滚动到当前歌词


onMounted(() => {
    // 初始化引用数组
    lyricRefs.value = new Array(parsedLyrics.value.length);

    // 开始模拟播放
    // startPlaybackSimulation();

    // 初始滚动到第一句歌词
    nextTick(() => {
        scrollToCurrentLyric();
    });
})


// 唱片动画效果
const isPlaying = ref(false);
const rotation = ref(0);
const animationFrame = ref(null);
let lightPoints = ref(null)
let radius = 0;

// 获取光点样式
const getLightPointStyle = (index) => {
    const angle = (index / 12) * 360;
    if (lightPoints.value) {
        radius = (lightPoints.value.offsetHeight) * 0.45
    }

    return {
        '--angle': `${angle}deg`,
        '--radius': `${radius}px`,
        '--delay': `${index * 0.2}s`
    };
};
// 更新动画
const updateAnimation = () => {
    rotation.value = (rotation.value + 0.5) % 360;
    animationFrame.value = requestAnimationFrame(updateAnimation);
};

// 切换播放状态，当开始播放时开始动画
watch(() => paused.value, (n) => {
    isPlaying.value = !n
    if (isPlaying.value && !animationFrame.value) {
        updateAnimation();
    }
})
// 组件挂载
onMounted(() => {
    updateAnimation();
});

// 组件卸载
onUnmounted(() => {
    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
    }
});

watch(() => lyricsDrawer.value, (n) => {
    if (n) {
        if (!animationFrame.value) {
            updateAnimation();
        }
    } else {
        if (animationFrame.value) {
            cancelAnimationFrame(animationFrame.value);
        }
    }
})

// 音乐可视化
// audio
const visualizerCanvas = ref(null);
const canvasContainer = ref(null);


// 可视化参数
const canvasWidth = ref(800);
const canvasHeight = ref(600);
const ctx = ref(null);
const animationFrameCanvas = ref(null);

// 音频分析器
let audioContext = null;
let analyser = null;
let source = null;
let dataArray = null;
let bufferLength = null;

// 音频分析数据
const currentFrequency = ref(0);
const currentAmplitude = ref(0);
const currentTempo = ref(120);
const showAnalysisInfo = ref(true);


// 初始化Canvas
const initCanvas = () => {
    nextTick(() => {
        if (!visualizerCanvas.value || !canvasContainer.value) return;

        const canvas = visualizerCanvas.value;
        ctx.value = canvas.getContext('2d');

        // 获取容器尺寸
        const containerRect = canvasContainer.value.getBoundingClientRect();
        canvasWidth.value = containerRect.width;
        canvasHeight.value = containerRect.height;

        // 设置Canvas尺寸
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasWidth.value * dpr;
        canvas.height = canvasHeight.value * dpr;
        ctx.value.scale(dpr, dpr);

        // 开始动画循环
        startVisualization();
    })
};

// 初始化音频分析器
const initAudioAnalyser = () => {
    if (!audio.value) return;

    // 如果已经存在音频上下文，就不创建
    if (!audioContext) {
        // 创建新的音频上下文
        audioContext = new window.AudioContext();
        analyser = audioContext.createAnalyser();

        // 创建新的源节点
        source = audioContext.createMediaElementSource(audio.value);

        // 连接音频节点
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // 配置分析器
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
};

watch(() => SongUrl.value, (n) => {
    initAudioAnalyser()
})

// 开始可视化动画
const startVisualization = () => {
    if (!ctx.value) return;

    const draw = () => {
        // 清除画布
        ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
        drawAnalysisInfo();

        // 继续动画循环
        animationFrameCanvas.value = requestAnimationFrame(draw);
    };

    draw();
};

// 绘制分析信息
function drawAnalysisInfo() {
    const ctxRef = ctx.value;
    const width = canvasWidth.value;
    const height = canvasHeight.value;

    // 绘制频谱图
    if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);

        // 频谱图尺寸和位置
        const spectrumWidth = width - 10;
        const spectrumHeight = 30;
        const spectrumX = 5;
        const spectrumY = height - spectrumHeight;


        // 实现左右翻转拼合效果
        const barCount = 512;  // 总共要绘制的条形数（必须是偶数）
        const halfBars = barCount / 2;
        const barSpacing = 0.5;
        const barWidth = (spectrumWidth / barCount) - barSpacing;

        for (let i = 0; i < halfBars; i++) {
            // 获取对应的频率数据
            const startFreqRatio = 0.05; // 忽略前10%的低频
            const dataIndex = Math.floor((startFreqRatio + (i / halfBars) * (1 - startFreqRatio)) * (bufferLength / 2));
            const value = dataArray[dataIndex];
            const barHeight = (value / 255) * spectrumHeight;

            // 计算颜色
            const hue = (value / 255) * 120 + 180;

            // 左半边：从中间向左绘制（反转顺序）
            const leftX = spectrumX + (halfBars - i - 1) * (barWidth + barSpacing);
            const leftY = spectrumY + spectrumHeight - barHeight;

            // 右半边：从中间向右绘制（正序）
            const rightX = spectrumX + halfBars * (barWidth + barSpacing) + i * (barWidth + barSpacing);
            const rightY = spectrumY + spectrumHeight - barHeight;

            // 绘制左半边条形
            ctxRef.fillStyle = '#4a9eff';  // 固定蓝色
            ctxRef.fillRect(leftX, leftY, barWidth, barHeight);

            // 绘制右半边条形
            ctxRef.fillStyle = '#4a9eff';  // 固定蓝色
            ctxRef.fillRect(rightX, rightY, barWidth, barHeight);
        }
    }
}
// 监听窗口大小变化
const handleResize = () => {
    initCanvas();
};

// 组件挂载
onMounted(() => {
    window.addEventListener('resize', handleResize);
});

watch(() => lyricsDrawer.value, (n) => {
    if (n) {
        initCanvas()
    }
})

// 组件卸载
onUnmounted(() => {
    if (animationFrameCanvas.value) {
        cancelAnimationFrame(animationFrameCanvas.value);
    }

    if (audioContext) {
        audioContext.close();
    }

    window.removeEventListener('resize', handleResize);
});
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

        .iconfont {
            cursor: pointer;

            &:hover {
                color: rgb(52 211 153);
            }
        }
    }

    .content {
        flex: 1;
        padding-top: 20px;
        padding-bottom: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 50px;
        min-height: 0px;
        position: relative;

        .card {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .photo {
                position: relative;
                width: 80%;
                max-width: 400px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                aspect-ratio: 1 / 1;

                /* 光环层 */
                .halo-layer {
                    position: absolute;
                    border-radius: 50%;
                    animation: haloFloat 4s ease-in-out infinite;
                }

                .halo-outer {
                    width: 95%;
                    height: 95%;
                    background:
                        radial-gradient(circle at center,
                            rgba(74, 158, 255, 0.3) 0%,
                            rgba(74, 158, 255, 0.1) 40%,
                            transparent 70%);
                    box-shadow:
                        0 0 60px rgba(74, 158, 255, 0.4),
                        inset 0 0 40px rgba(74, 158, 255, 0.2);
                    animation-delay: 0s;
                }

                .halo-middle {
                    width: 85%;
                    height: 85%;
                    background:
                        radial-gradient(circle at center,
                            rgba(110, 181, 255, 0.4) 0%,
                            rgba(110, 181, 255, 0.2) 50%,
                            transparent 80%);
                    box-shadow:
                        0 0 40px rgba(110, 181, 255, 0.3),
                        inset 0 0 30px rgba(110, 181, 255, 0.1);
                    animation-delay: 0.5s;
                }

                .halo-inner {
                    width: 75%;
                    height: 75%;
                    background:
                        radial-gradient(circle at center,
                            rgba(143, 203, 255, 0.5) 0%,
                            rgba(143, 203, 255, 0.3) 60%,
                            transparent 90%);
                    box-shadow:
                        0 0 20px rgba(143, 203, 255, 0.2),
                        inset 0 0 20px rgba(143, 203, 255, 0.1);
                    animation-delay: 1s;
                }

                @keyframes haloFloat {

                    0%,
                    100% {
                        transform: scale(1);
                        opacity: 0.7;
                    }

                    50% {
                        transform: scale(1.05);
                        opacity: 1;
                    }
                }

                /* 动态光点 */
                .light-points {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                }

                .light-point {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2%;
                    height: 2%;
                    min-width: 6px;
                    /* 最小尺寸，避免太小 */
                    min-height: 6px;
                    background: radial-gradient(circle at center,
                            rgba(255, 255, 255, 0.9) 0%,
                            rgba(255, 255, 255, 0.7) 30%,
                            rgba(74, 158, 255, 0.5) 70%,
                            transparent 100%);
                    border-radius: 50%;
                    filter: blur(1px);
                    opacity: 0.7;
                    transform-origin: 0 0;
                    animation:
                        pointPulse 2s ease-in-out infinite,
                        pointRotate 10s linear infinite;
                    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) scale(1);
                    z-index: 3;
                }

                @keyframes pointPulse {

                    0%,
                    100% {
                        opacity: 0.5;
                        transform:
                            translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) scale(1);
                    }

                    50% {
                        opacity: 1;
                        transform:
                            translate(-50%, -50%) rotate(var(--angle)) translateX(calc(var(--radius) * 1.1)) scale(1.2);
                    }
                }

                @keyframes pointRotate {
                    0% {
                        transform:
                            translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius));
                    }

                    100% {
                        transform:
                            translate(-50%, -50%) rotate(calc(var(--angle) + 360deg)) translateX(var(--radius));
                    }
                }

                /* 唱片 */
                .vinyl {
                    position: absolute;
                    width: 60%;
                    height: 60%;
                    border-radius: 50%;
                    background:
                        /* 金属光泽 */
                        linear-gradient(135deg,
                            rgba(20, 20, 30, 0.9) 0%,
                            rgba(40, 40, 60, 0.9) 50%,
                            rgba(20, 20, 30, 0.9) 100%),
                        /* 色彩叠加 */
                        radial-gradient(circle at 30% 30%,
                            rgba(74, 158, 255, 0.4) 0%,
                            transparent 60%);
                    box-shadow:
                        inset 0 0 50px rgba(0, 0, 0, 0.8),
                        inset 0 0 30px rgba(74, 158, 255, 0.3),
                        0 10px 40px rgba(0, 0, 0, 0.7),
                        0 0 60px rgba(74, 158, 255, 0.2);
                    z-index: 10;
                    transition: transform 0.3s ease;
                    overflow: hidden;


                    /* 唱片标签 */
                    .vinyl-label {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 50%;
                        height: 50%;
                        border-radius: 50%;
                        background: linear-gradient(135deg,
                                rgba(20, 20, 30, 0.9) 0%,
                                rgba(40, 40, 60, 0.9) 100%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 11;
                        box-shadow:
                            inset 0 0 20px rgba(0, 0, 0, 0.8),
                            0 0 20px rgba(74, 158, 255, 0.3);
                        border: 2px solid rgba(74, 158, 255, 0.3);

                        .label-content {
                            width: 100%;
                            height: 100%;
                            color: white;

                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }

                    /* 唱片纹理 */
                    .vinyl-texture {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background-image:
                            repeating-radial-gradient(circle at 50% 50%,
                                transparent,
                                transparent 5px,
                                rgba(255, 255, 255, 0.03) 5px,
                                rgba(255, 255, 255, 0.03) 6px);
                        opacity: 0.4;
                        z-index: 9;
                    }

                }

                .vinyl.playing {
                    animation: vinylRotate 10s linear infinite;
                }

                @keyframes vinylRotate {
                    0% {
                        transform: rotate(0deg);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }
            }

        }

        .body {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;

            .title {
                // height: 50px;
                padding: 10px 0px;

                .h1 {
                    font-size: 20px;
                }

                .songer {
                    font-size: 16px;
                }
            }

            .lyrics-wrapper {
                flex: 1;
                overflow-y: auto;
                min-height: 0px;

                &::-webkit-scrollbar {
                    display: none;
                }

                .lyricLineBox {
                    transition: all 1s linear;

                    .lyric-line {
                        padding: 10px 5px;
                        cursor: pointer;

                        &:hover {
                            background-color: rgba(229, 231, 235);
                        }
                    }

                    .active {
                        background: rgba(74, 158, 255, 0.2);
                        color: #fff;
                        padding: 10px 10px;
                        font-size: 18px;
                        font-weight: bold;
                        transform: scale(1.02);
                    }

                    .passed {
                        color: #8fcbff;
                    }
                }


            }
        }
    }

    .progressBar {
        width: 100%;
        position: relative;

        .canvas {
            position: absolute;
            top: -50px;
            bottom: 0px;
            height: 50px;
            width: 100%;
            margin: 0 auto;
            border-radius: 20px;
            overflow: hidden;

            /* Canvas画布 */
            .visualizer-canvas {
                width: 100%;
                height: 100%;
                z-index: 10;
                opacity: 0.4;
            }
        }

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
            padding-left: 10px;
            padding-right: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .info {
                width: 11%;
            }

            .operate {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }

            .status {
                height: 100%;
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