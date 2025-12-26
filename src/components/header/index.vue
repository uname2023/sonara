<template>
    <div id="header">
        <div class="search">
            <div style="cursor: pointer;" @click="router.back()">
                <i class="icon-jiantou-zuo iconfont"></i>
            </div>
            <div style="cursor: pointer;" @click="router.forward()">
                <i class="iconfont icon-jiantouyou"></i>
            </div>
            <el-popover ref="popoverRef" :virtual-ref="searchRef" virtual-triggering popper-class="popperStyle"
                placement="bottom" width="200" trigger="focus">
                <div class="boxCard">
                    <p style="font-size: 16px;">{{ hotSearchVal.title }}</p>
                    <ul v-if="state">
                        <li v-for="(item, index) in hotSearchVal.currentList" :key="index">
                            <div v-if="!searchVal" class="hot" @click="hotSearch(item)">
                                <div>{{ index + 1 }}.&nbsp;&nbsp;{{ item.name
                                }}</div>
                                <div style="color: rgb(52 211 153);">{{ Math.round(parseInt(item.playCount) /
                                    1000) / 10 }}万</div>
                            </div>
                            <div v-if="searchVal" class="hot" @click="searchUrl(item)">
                                <span style="color: rgb(52 211 153);">{{ item.name }}&nbsp;&nbsp;</span>
                                <span>-{{ item.artists[0].name }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </el-popover>
            <el-input ref="searchRef" style="width: auto;" size="small" clearable placeholder="搜素音乐、MV、歌单"
                prefix-icon="Search" v-model="searchVal">
            </el-input>
        </div>
        <div class="user" style="cursor: pointer;">
            <el-avatar :size="30">
                <img :src="userData.avatarUrl" />
            </el-avatar>
            <span @click="login" v-show="!isLogin">点击登录</span>
            <i :class="themeicon" class="iconfont" @click="changeTheme"></i>
            <i class="icon-operate iconfont" @click="operate"></i>
            <div class="operate"
                :style="{ display: operateVis ? 'flex' : 'none', zIndex: 100, color: theme.fontColor, backgroundColor: theme.mainColor }">
                <p @click="logout" @mouseenter="enter($event)" @mouseleave="leave($event)">
                    退出登录
                </p>
            </div>
            <el-dialog v-model="dialogVisible" width="300px" :before-close="handleClose">
                <div class="dislogBox">
                    <el-form :model="form" label-width="auto" label-position="top" style="max-width: 600px">
                        <el-form-item label="用户名">
                            <el-input placeholder="Please input username" v-model="form.username" />
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" placeholder="Please input password"
                                show-password />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">登录</el-button>
                            <el-button @click="dialogVisible = !dialogVisible">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import requests from '@/api/request'
import { useTheme } from '@/store/theme';
import { useMusic } from "@/store/music"
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useData } from 'element-plus/es/components/table-v2/src/composables/use-data.mjs';
import { useLogin } from "@/store/login/login"
let route = useRoute()
let router = useRouter()

let theme = useTheme()

let searchWord = ref("")
let themeicon = ref("icon-taiyang")//icon-taiyang,icon-moon
let rankList = ref([])
let dialogVisible = ref(false)
let operateVis = ref(false)
let hotSearchVal = reactive({
    title: "热门歌曲",
    currentList: []
})
const searchRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
    popoverRef.value?.hide()
}



let timer = null//设置定时器的全局容器
let state = ref(true)

function changeTheme() {
    themeicon.value = themeicon.value == "icon-taiyang" ? "icon-moon" : "icon-taiyang"
    theme.changeTheme()
}
function login() {
    dialogVisible.value = true
}

function handleClose(done) {
    done()
}
function operate() {
    operateVis.value = operateVis.value == true ? false : true
}
function enter(e) {
    e.target.style.backgroundColor = theme.catelogueColor == "#f0f0f0" ? "#e5e7eb" : ""
}
function leave(e) {
    e.target.style.backgroundColor = ""
}
function hotSearch(item) {
    searchVal.value = item.searchWord
}
let music = useMusic()
let { SongUrl, currentSongId, imgsList, paused, musicState } = storeToRefs(music)
function searchUrl(item) {
    music.addSongsUrl(item.id, 0)
    let tempArr = []
    let tempObj = {}
    tempObj.musicId = item.id
    tempObj.musicName = item.name
    // tempObj.musicPic = item.artists[0].img1v1Url
    tempObj.musicPic = item.coverImgUrl
    tempObj.musicAuthor = item.artists[0].name
    tempArr.push(tempObj)
    tempObj = {}
    music.imgsListAdd(tempArr)
    music.songPlay()
    if (!musicState) {
        ElMessage({
            showClose: true,
            message: '460 网路拥挤 请稍后重试',
            type: 'error',
            center: true
        });
    }
}
requests({ url: "/search/hot/detail" }).then(res => {
    rankList = res.data
    hotSearchVal.currentList = rankList
}, err => {
    console.log(err);
})

let searchVal = computed({
    get() {
        return searchWord.value
    },
    set(val) {
        if (timer !== null) {
            clearTimeout(timer)
        }
        if (val) {
            state.value = false
            searchWord.value = val
            timer = setTimeout(() => {
                requests({ url: `/search/song?keyword=${val}` }).then(res => {
                    hotSearchVal.currentList = res.data
                    hotSearchVal.title = "单曲"
                    state.value = true
                }, err => {
                    console.log(err);
                })
            }, 500)
        } else {
            state.value = true
            hotSearchVal.title = "热门歌曲"
            hotSearchVal.currentList = rankList
            searchWord.value = ""
        }
    }
})


// 登录功能
let form = reactive({
    username: "admin",
    password: "123456"
})
let userData = reactive({
    avatarUrl: "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
    nickname: "",
    role: "",
    userId: 0,
    username: ""
})
let Login = useLogin()
let { isLogin } = storeToRefs(Login)

function onSubmit() {
    requests.post("/auth/login", form).then(
        res => {
            userData.avatarUrl = res.data.avatarUrl
            userData.nickname = res.data.nickname
            userData.role = res.data.role
            userData.userId = res.data.userId
            userData.username = res.data.username
            const { token } = res.data
            // 存储 token
            localStorage.setItem("sonara_token", token)
            isLogin.value = true
            ElMessage({
                showClose: true,
                message: "登录成功",
                type: 'success',
                center: true,
            });
            dialogVisible.value = !dialogVisible.value
        }, err => {
            console.log(form);
            console.log(err);
            ElMessage({
                showClose: true,
                message: err,
                type: 'error',
                center: true,
            });
        })
}
function logout() {
    localStorage.removeItem("sonara_token")
    userData.avatarUrl = "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
    userData.nickname = ""
    userData.role = ""
    userData.userId = 0
    userData.username = ""
    isLogin.value = false
    operateVis.value = false

}


onMounted(() => {
    const token = localStorage.getItem('sonara_token')
    if (token) {
        requests.get("/auth/profile").then(res => {
            userData.avatarUrl = res.data.avatarUrl
            userData.nickname = res.data.nickname
            userData.userId = res.data.id
            userData.username = res.data.username
            isLogin.value = true
        })
    }

})
</script>

<style lang="less" scoped>
#header {
    height: 100%;
    // background-color: red;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .search {
        width: 280px;
        display: flex;
        align-items: center;
        position: relative;
        justify-content: space-between;

        :deep(.el-input__wrapper) {
            width: 210px;
            border-radius: 32px;
            background-color: rgb(241 245 249);
            height: 32px;
        }


    }

    .user {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        .operate {
            width: 80px;
            height: 50px;
            box-shadow: 0 0 0 1px #dcdfe6 inset;
            border-radius: 8px;
            position: absolute;
            top: 46px;
            right: 0px;
            font-size: 12px;
            display: flex;
            align-items: center;
            padding: 0 10px;

            p {
                height: 26px;
                line-height: 26px;
                padding-left: 10px;
                width: 100%;
                border-radius: 8px;
            }
        }

        .dislogBox {
            display: flex;
            padding: 10px;
            justify-content: center;
            align-items: center;

            :deep(.el-form-item__content) {
                justify-content: center;
            }
        }

        .el-moon,
        .icon-taiyang,
        .icon-operate {
            font-size: 20px;
        }



        span {
            cursor: pointer;
            display: block;
            font-size: 13px;
        }

        span:hover {
            color: rgb(52 211 153);
        }
    }

    .iconfont:hover {
        color: rgb(52 211 153);
    }
}
</style>

<style lang="less">
.popperStyle {
    padding: 0px !important;
    height: 384px;
}

.boxCard {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;

    .hot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        font-size: 12px;
    }

    li {
        cursor: pointer;
    }

    li:hover {
        color: rgb(52 211 153);
    }
}

.boxCard {
    overflow-y: auto;
    overflow-x: hidden;
}

/* 滚动条样式 */
.boxCard::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

/* 滚动条滑块（里面小方块） */
.boxCard::-webkit-scrollbar-thumb {
    border-radius: 10px;
}

/* hover时显色 */
.boxCard:hover::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
}
</style>