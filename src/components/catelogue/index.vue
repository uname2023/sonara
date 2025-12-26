<template>
    <div id="catelogue" :style="{ color: theme.fontColor, backgroundColor: theme.catelogueColor }">
        <img class="brand" :src="theme.imgSrc">
        <div class="list">
            <div class="onlineMusic">
                <div class="title">在线音乐</div>
                <ul>
                    <li v-for="item in onlineMusic" :key="item.id" @click="change(item)" @mouseenter="enter($event)"
                        @mouseleave="leave($event)" :class="{ current: routeName == item.path }">
                        <div class="iconfont" :class="item.class"></div>
                        <span>{{ item.title }}</span>
                    </li>
                </ul>
            </div>
            <div class="myMusic">
                <div class="title">我的音乐</div>
                <ul>
                    <li v-for="item in myMusic" :key="item.id" @click="change(item)" @mouseenter="enter($event)"
                        @mouseleave="leave($event)" :class="{ current: routeName == item.path }">
                        <div class="iconfont" :class="item.class"></div>
                        <span>{{ item.title }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useTheme } from '@/store/theme/index'
import { useRoute, useRouter } from 'vue-router';
let theme = useTheme()
let onlineMusic = [
    {
        id: "1",
        title: "推荐",
        class: "icon-xingqiu",
        path: "recommend",
    },
    {
        id: "2",
        class: "icon-yinle",
        title: "音乐馆",
        path: "musicHall",
    }
]


let myMusic = [
    {
        id: "1",
        class: "icon-shoucang",
        title: "我喜欢",
        path: "myLike",
    },
    {
        id: "",
        class: "icon-shipin",
        title: "最近播放",
        path: "recently",
    },
]


let route = useRoute()
let routeName = computed({
    get() {
        return route.name
    }
})

let router = useRouter()
function change(item) {
    for (let i of onlineMusic) {
        i.iscurrent = false
    }
    for (let i of myMusic) {
        i.iscurrent = false
    }
    item.iscurrent = true
    router.push(item.path)
}
function enter(e) {
    e.target.style.backgroundColor = theme.catelogueColor == "#f0f0f0" ? "#e5e7eb" : ""
}
function leave(e) {
    e.target.style.backgroundColor = ""
}
</script>

<style lang="less">
#catelogue {
    height: 100%;
    position: relative;
    padding-top: 100px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;

    .brand {
        position: absolute;
        top: 30px;
        left: 30px;
        width: 120px;
    }

    .list {
        width: 176px;
        height: 490px;
        position: absolute;
        top: 100px;
        left: 20px;

        .onlineMusic,
        .myMusic {
            display: flex;
            flex-direction: column;
            height: 133px;
            margin-bottom: 30px;

            .title {
                height: 40px;
                font-size: 16px;
                line-height: 25px;
                color: #9d9a9a;
                padding-left: 20px;
            }

            ul {
                flex: 1;
                list-style-type: none;
                display: flex;
                flex-direction: column;

                li {
                    flex: 1;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    border-radius: 8px;
                    padding-left: 20px;

                    span {
                        margin-left: 10px;
                    }
                }

            }
        }

    }

}

.current {
    background: linear-gradient(90deg, rgba(45, 212, 190, 1) 0%, rgba(52, 211, 154, 1) 100%);
}

/* 滚动条样式 */
#catelogue::-webkit-scrollbar {
    width: 0px;
    /*  设置纵轴（y轴）轴滚动条 */
    height: 0px;
    /*  设置横轴（x轴）轴滚动条 */
}

/* 滚动条滑块（里面小方块） */
#catelogue::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
}

/* 滚动条轨道 */
#catelogue::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0, 0, 0, 0);
}

/* hover时显色 */
#catelogue:hover::-webkit-scrollbar {
    width: 6px;
    height: 4px;
}
</style>