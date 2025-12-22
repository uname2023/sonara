<template>
  <div class="playList">
    <div class="informBox">
      <img :src="songerInfor.cover" style="width: 176px;height: 176px;border-radius: 50%;">
      <div class="textTitle">
        <div class="mainTitle">
          <div style="font-weight: 700;font-size: 24px;">{{ songerInfor.name }}</div>
          <div class="more">
            <div class="aAt">
              <div class="author">
                <span>{{ songerInfor.briefDesc }}</span>
              </div>
            </div>
            <div class="descrip">
              <span>单曲数:&nbsp;&nbsp;{{ songerInfor.musicSize }}</span>
              <span>专辑数:&nbsp;&nbsp;{{ songerInfor.albumSize }}</span>
              <span>MV数:&nbsp;&nbsp;{{ songerInfor.mvSize }}</span>
            </div>
          </div>
        </div>
        <div class="operate">
          <button style="background-color: rgb(5, 150, 105);color: white;width: 128px;">
            <span style="margin-right: 4px;" class="iconfont icon-shoucang"></span>
            <span>关注</span>
          </button>
          <button style="width: 128px;">
            <span style="margin-right: 4px;" class="iconfont icon-24gl-play"></span>
            <span>电台</span>
          </button>
          <button style="width: 32px;">
            <span class="iconfont icon-gengduo"></span>
          </button>
        </div>
      </div>
    </div>
    <div class="songBox">
      <el-tabs v-model="activeName">
        <el-tab-pane label="精选" name="first">
          <div class="songs ">
            <ul class="list">
              <li class="tHead">
                <div style="flex:2 ;">歌曲</div>
                <div style="flex:1 ;">专辑</div>
                <div style="flex:1 ;">时长</div>
              </li>
              <li class="tBody" v-for="(item, index) in hotSongList" :key="index"
                @click="musicPlay(hotSongList, item, index)">
                <div style="flex: 2;"><span class="iconfont icon-shoucang"></span><span>{{ item.name
                    }}</span>
                  <span v-if="item.mv" @click.stop="toMV(item)" class="iconfont icon-MV"
                    style="color:orange;margin-left: 5px;"></span>
                </div>
                <div style="flex: 1;">{{ item.ar[0].name }}</div>
                <div style="flex: 1 ;">{{ duration(item.dt) }}</div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane :label=songLabel name="second">
          <div class="contro">
            <span :class="{ click: playOrder == 'hot' }" @click="changeOrder('hot')">最热</span>
            <span :class="{ click: playOrder == 'time' }" @click="changeOrder('time')">最新</span>
          </div>
          <div class="songs ">
            <ul class="list">
              <li class="tHead">
                <div style="flex:2 ;">歌曲</div>
                <div style="flex:1 ;">专辑</div>
                <div style="flex:1 ;">时长</div>
              </li>
              <li class="tBody" v-for="(item, index) in playLists" :key="index"
                @click="musicPlay(playLists, item, index)">
                <div style="flex: 2;">
                  <span class="iconfont icon-shoucang"></span>
                  <span>{{ item.name }}</span>
                  <span v-if="item.mv" @click.stop="toMV(item)" class="iconfont icon-MV"
                    style="color:orange;margin-left: 5px;"></span>
                </div>
                <div style="flex: 1;">{{ item.ar[0].name }}</div>
                <div style="flex: 1 ;">{{ duration(item.dt) }}</div>
              </li>
            </ul>
            <p class="moreSonger" @click="addPlayList">加载更多</p>
          </div>
        </el-tab-pane>
        <el-tab-pane :label=albumLabel name="third">
          <albumVue :id="id"></albumVue>
        </el-tab-pane>
        <el-tab-pane :label=mvLabel name="forth">
          <MVListVue :id="id"></MVListVue>
        </el-tab-pane>
        <el-tab-pane label="详情" name="fifth">
          <descriptionVue :id="id"></descriptionVue>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import requests from '@/api/request'
import MVListVue from './MVList.vue'
import albumVue from './album.vue'
import descriptionVue from './description.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, ref } from 'vue'
import { useMusic } from '@/store/music'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'

let route = useRoute()
let id = route.query.id
let activeName = ref("first")
let offset = 50//从哪一首歌曲开始请求
let musicInforList = ref([])//遍历的歌曲数组
let songerInfor = ref([])//歌手的信息列表
let hotSongList = ref([])//精选歌单
let playLists = ref([])//歌单列表
let albumList = ref([])//专辑列表
let mvList = ref([])//mv列表
let description = ref([])
let playOrder = ref('hot')

let music = useMusic()
let { musicState } = storeToRefs(music)

let songLabel = computed({
  get() {
    let size = songerInfor.value.musicSize;
    return size ? '歌曲' + size : '歌曲'
  }
})

let albumLabel = computed({
  get() {
    let size = songerInfor.value.albumSize;
    return size ? '专辑' + size : '专辑'
  }
})

let mvLabel = computed({
  get() {
    let size = songerInfor.value.mvSize;
    return size ? '视频' + size : '视频'
  }
})


function musicPlay(list, item, index) {
  music.addSongsUrl(item.id, index)
  let tempArr = []
  let tempObj = {}
  list.forEach(item => {
    tempObj.musicId = item.id
    tempObj.musicName = item.name
    tempObj.musicPic = item.al.picUrl
    tempObj.musicAuthor = songerInfor.value.name
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

function duration(dt) {
  let duration = dt / 1000
  var end_min = Math.floor(duration / 60)
  end_min = end_min >= 10 ? end_min : ("0" + end_min)
  var end_s = Math.floor(duration % 60)
  end_s = end_s >= 10 ? end_s : ("0" + end_s)
  return end_min + ":" + end_s
}

function playListReq() {
  requests({ url: `/artist/songs?id=${id}&limit=54&order=${playOrder.value}` }).then(res => {
    playLists.value = res.songs
  }, err => {
    console.log(err);
  })
}

function changeOrder(order) {
  playOrder.value = order
  playListReq()
}



function addPlayList() {
  requests({ url: `/artist/songs?id=${id}&limit=54&offset=${offset}&order=${playOrder.value}` }).then(res => {
    playLists.value = playLists.value.concat(res.songs)
    offset += 50
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

let router = useRouter()
function toMV(item) {
  router.push({
    name: "MVdetail",
    query: {
      id: item.mv
    }
  })
}

onBeforeMount(() => {
  requests({ url: `/artist/detail?id=${id}` }).then(res => {
    songerInfor.value = res.data.artist
  }, err => {
    console.log(err);
  })
  requests({ url: `/artist/top/song?id=${id}` }).then(res => {
    hotSongList.value = res.songs
  }, err => {
    console.log(err);
  })
  playListReq()
})

</script>

<style lang="less" scoped>
.playList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .informBox {
    position: relative;
    display: flex;
    width: 100%;
    align-items: stretch;

    .iconfont {
      font-size: 14px;
    }

    .textTitle {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
      position: relative;
      margin: 0px 20px;

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
            margin: 20px 0px;
            display: flex;
            column-gap: 20px;
            color: rgb(107, 114, 128);
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

    .contro {
      display: flex;
      align-items: center;
      column-gap: 10px;
      justify-content: end;
      font-size: 12px;
      margin: 20px 0;

      span {
        cursor: pointer;
      }
    }

    .click {
      color: rgb(5, 150, 105);
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
}
</style>