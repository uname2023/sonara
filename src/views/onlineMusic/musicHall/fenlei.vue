<template>
  <div class="fenlei">
    <div class="categroy">
      <div @click="changeTag('全部')">全部</div>
      <div @click="changeTag(item.name)" v-for="(item, index) in category" :key="index">{{ item.name }}</div>
    </div>
    <div class="title" style="margin: 20px 0px ;font-size: 20px;line-height: 28px;">{{ tag }}歌单</div>
    <div class="content">
      <div class="mvBox" v-for="(item, index) in playLists" :key="index">
        <div class="imgBox">
          <div class="masking">
            <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
              class="iconfont icon-bofangqi-bofang">
            </span>
          </div>
          <img :src="item.coverImgUrl" style="width: 100%;min-width: 160px;border-radius: 8px;">
          <div class="playCount">
            <div class="iconfont icon-erji" style="margin-right: 5px;"></div>
            <div>{{ Math.round(parseInt(item.playCount) / 1000) / 10 }}万</div>
          </div>
        </div>
        <div style="margin-top: 8px;">
          <p>{{ item.name }}</p>
          <p style="color: rgb(148, 163, 184);">{{ item.creator.nickname }}</p>
        </div>
      </div>
    </div>
    <p class="moreSonger" @click="addPlayList">加载更多</p>
  </div>
</template>

<script setup>
import requests from '@/api/request';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
let playLists = ref([])
let offset = 40
let category = ref([])
let tag = ref("全部")
let before = 0//获取下一页歌单的参数

const { id } = defineProps(["id"])
let router = useRouter()
function toDetails(item) {
  router.push({
    name: "playList",
    query: {
      id: item.id
    }
  })
}
function addPlayList() {
  requests({ url: `/top/playlist/highquality?cat=${tag.value}&before=${before}&limit=35` }).then(res => {
    if (res.playlists > 0) {
      before = res.lasttime
      playLists.value = playLists.value.concat(res.playlists)
    } else {
      ElMessage({
        showClose: true,
        message: '没有更多了',
        type: 'error',
        center: true
      });
    }
  }, err => {
    console.log(err);
  })
}
function changeTag(nTag) {
  tag.value = nTag
  before = 0
  requests({ url: `/top/playlist/highquality?cat=${tag.value}&before=${before}&limit=35` }).then(res => {
    before = res.lasttime
    playLists.value = res.playlists
  }, err => {
    console.log(err);
  })
}
requests({ url: `/playlist/highquality/tags` }).then(res => {
  category.value = res.tags
}, err => {
  console.log(err);
})

requests({ url: `/top/playlist/highquality?cat=${tag.value}&before=${before}&limit=35` }).then(res => {
  before = res.lasttime
  playLists.value = res.playlists
}, err => {
  console.log(err);
})
</script>

<style lang="less" scoped>
.fenlei {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  position: relative;

  .categroy {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    div {
      height: 32px;
      border-radius: 8px;
      background-color: rgb(230, 230, 230);
      padding: 0px 10px;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
    }
  }

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
    grid-template-columns: repeat(5, 1fr);
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
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 15px;
      grid-row-gap: 15px;
    }
  }
}
</style>