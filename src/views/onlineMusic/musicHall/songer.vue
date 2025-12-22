<template>
  <div class="songer">
    <div class="choose">
      <div>
        <span>语种:</span>
        <ul>
          <li :class="{ cur: item.cur }" v-for="item in lan" :key="item.lable" @click="lanClick(item)">{{
            item.name }}
          </li>
        </ul>
      </div>
      <div>
        <span>分类:</span>
        <ul>
          <li :class="{ cur: item.cur }" v-for="item in categroy" :key="item.lable" @click="categroyClick(item)">
            {{
              item.name }}</li>
        </ul>
      </div>
      <div>
        <span>筛选:</span>
        <ul>
          <li :class="{ cur: item.cur }" v-for="(item, index) in sift" :key="index" @click="siftClick(item)">{{
            item.name }}</li>
        </ul>
      </div>
    </div>
    <div class="content">
      <div @click="songerDetails(item)" v-for="(item, index) in songerList" :key="index">
        <img :src="state ? item.img1v1Url : coverimg.value" loading="lazy">
        <p>{{ state ? item.name : "周小建" }}</p>
      </div>
    </div>
    <p class="moreSonger" @click="moreSonger">加载更多</p>
  </div>
</template>

<script setup>
import requests from '@/api/request';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
let lan = [{
  name: "全部",
  lable: "-1",
  cur: true,
}, {
  name: "华语",
  lable: "7",
  cur: false,
}, {
  name: "欧美",
  lable: "96",
  cur: false,
}, {
  name: "日本",
  lable: "8",
  cur: false,
}, {
  name: "韩国",
  lable: "16",
  cur: false,
}, {
  name: "其他",
  lable: "0",
  cur: false,
}]
let categroy = [{
  name: "全部",
  lable: "-1",
  cur: true,
}, {
  name: "男歌手",
  lable: "1",
  cur: false,
}, {
  name: "女歌手",
  lable: "2",
  cur: false,
}, {
  name: "乐队组合",
  lable: "3",
  cur: false,
}]
let sift = [
  { name: "热门", lable: "-1", cur: true },
  { name: "A", lable: "a", cur: false },
  { name: "B", lable: "b", cur: false },
  { name: "C", lable: "c", cur: false },
  { name: "D", lable: "d", cur: false },
  { name: "E", lable: "e", cur: false },
  { name: "F", lable: "f", cur: false },
  { name: "G", lable: "g", cur: false },
  { name: "H", lable: "h", cur: false },
  { name: "I", lable: "i", cur: false },
  { name: "J", lable: "j", cur: false },
  { name: "K", lable: "k", cur: false },
  { name: "L", lable: "l", cur: false },
  { name: "M", lable: "m", cur: false },
  { name: "N", lable: "n", cur: false },
  { name: "O", lable: "o", cur: false },
  { name: "P", lable: "p", cur: false },
  { name: "Q", lable: "q", cur: false },
  { name: "R", lable: "r", cur: false },
  { name: "S", lable: "s", cur: false },
  { name: "T", lable: "t", cur: false },
  { name: "U", lable: "u", cur: false },
  { name: "V", lable: "v", cur: false },
  { name: "W", lable: "w", cur: false },
  { name: "X", lable: "x", cur: false },
  { name: "Y", lable: "y", cur: false },
  { name: "Z", lable: "z", cur: false },
  { name: "#", lable: "0", cur: false },
]
let cur = {
  lan: "-1",
  categroy: "-1",
  sift: "-1"
}
let songerList = ref([])
let state = ref(false)
let coverimg = ref("/imgs/1003.png")
let offset = ref(0)

function lanClick(item) {
  lan.forEach(ele => {
    ele.cur = false
  })
  item.cur = true
  cur.lan = item.lable
  songerReq()
}
function categroyClick(item) {
  categroy.forEach(ele => {
    ele.cur = false
  })
  item.cur = true
  cur.categroy = item.lable
  songerReq()

}
function siftClick(item) {
  sift.forEach(ele => {
    ele.cur = false
  })
  item.cur = true
  cur.sift = item.lable
  songerReq()
}
let router = useRouter()
function songerDetails(item) {
  router.push({
    name: "songerList",
    query: {
      id: item.id
    }
  })
}
function songerReq() {
  state.value = false
  requests({ url: `/artist/list?limit=60&type=${cur.categroy}&area=${cur.lan}&initial=${cur.sift} ` }).then(res => {
    songerList.value = res.artists
    state.value = true
    offset.value += 60
  }, err => {
    console.log(err);
  })
}
function moreSonger() {
  requests({ url: `/artist/list?limit=60&offset.value=${offset.value}&type=${cur.categroy}&area=${cur.lan}&initial=${cur.sift} ` }).then(res => {
    songerList.value = songerList.value.concat(res.artists)
    offset.value += 60
  }, err => {
    console.log(err);
    $message({
      showClose: true,
      message: '没有更多了',
      type: 'error',
      center: true
    });
  })
}
onBeforeMount(() => {
  songerReq()
})
</script>

<style lang="less" scoped>
.songer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .choose {
    font-size: 14px;

    div {
      display: flex;
      align-items: center;
      column-gap: 10px;
      margin: 15px 0px;

      span {
        font-size: 13px;
        color: rgb(148, 163, 184);
      }

      ul {
        display: flex;
        align-items: center;
        column-gap: 10px;

        li {
          padding: 0px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .cur {
          background-color: rgb(52, 211, 153);
          color: white;
        }
      }
    }
  }

  .content {
    flex: 1;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 20px;

    div {
      text-align: center;
      cursor: pointer;

      img {
        width: 100%;
        border-radius: 50%;
      }
    }
  }

  &>p {
    cursor: pointer;
    width: 100%;
    text-align: center;
    padding: 30px 0px;
    color: rgb(52, 211, 153);
  }
}
</style>