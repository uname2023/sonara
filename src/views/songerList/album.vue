<template>
  <div class="albumList">
    <div class="content">
      <div class="Musiccard" v-for="(item, index) in albumList" :key="item.id">
        <div class="imgBox">
          <div class="masking">
            <span @click="toDetails(item)" style="color: white;cursor: pointer;font-size: 45px;"
              class="iconfont icon-bofangqi-bofang">
            </span>
          </div>
          <img style="border-radius: 8px;cursor: pointer; min-width: 160px; width: 100%;" :src="item.picUrl"
            class="image">
        </div>
        <div style="padding: 5px;">
          <span style="font-size: 12px;">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <p class="moreSonger" @click="addAlbumList">加载更多</p>
  </div>
</template>

<script setup>
import requests from '@/api/request'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const { id } = defineProps(["id"])
let albumList = ref([])
let offset = ref(40)

let router = useRouter()
function toDetails(item) {
  router.push({
    name: "albumDetail",
    query: {
      id: item.id
    }
  })
}
function addAlbumList() {
  requests({ url: `/artist/album?id=${id}&limit=40&offset=${offset.value}` }).then(res => {
    albumList.value = albumList.value.concat(res.hotAlbums)
    offset.value += 40
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

requests({ url: `/artist/album?id=${id}&limit=40` }).then(res => {
  albumList.value = res.hotAlbums
}, err => {
  console.log(err);
})

</script>

<style lang="less" scoped>
.albumList {
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
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 15px;
    grid-row-gap: 15px;
  }

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

    .masking:hover {
      opacity: 0.5;
      transform: translateY(-5px);
    }

    .masking:hover+img {
      transform: translateY(-5px);
    }
  }

  .Musiccard img {
    transition-property: all;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
    transition-duration: .5s;
    display: flex;
  }

  @media (min-width: 0) and (max-width:1040px) {
    .content {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(4, 1fr);
      grid-column-gap: 15px;
      grid-row-gap: 15px;
    }
  }
}
</style>