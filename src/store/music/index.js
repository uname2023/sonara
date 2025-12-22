import requests from "@/api/request";

import { defineStore } from "pinia";

const option = {
  // 真正存储数据的地方
  state() {
    return {
      currentSongId: 0,
      // songsList: [],
      imgsList: [],
      paused: true,
      musicState: true,
      SongUrl: "",
    }
  },
  actions: {
    // 传入歌曲的id即可
    addSongsUrl(id, index) {
      requests({
        url: `/song/url/v1?id=${id}&level=standard`,
      }).then(
        (res) => {
          if (res.code == 200) {
            this.addSongUrl(res.data[0].url)
            this.songsId(index)
            this.musicState = true
          } else {
            console.log(res.code + ":" + res.message);
            this.musicState = false
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    lastOne() {
      if (this.imgsList.length) {
        this.lastKMusic()
        this.addSongsUrl(this.imgsList[this.currentSongId].musicId, this.currentSongId)
      } else {
        return "播放列表为空"
      }
    },
    nextOne() {
      if (this.imgsList.length) {
        console.log(this.imgsList[this.currentSongId].musicId);
        this.nextMusic()
        this.addSongsUrl(this.imgsList[this.currentSongId].musicId, this.currentSongId)
      } else {
        return "播放列表为空"
      }
    },
    songsId(id) {
      this.currentSongId = id
    },
    songsListAdd(list) {
      this.songsList = list
    },
    imgsListAdd(list) {
      this.imgsList = list
    },
    songPlay() {
      this.paused = false
    },
    songPause() {
      this.paused = true
    },
    lastKMusic() {
      if (this.currentSongId == 0) {
        this.currentSongId = this.imgsList.length - 1;
      } else {
        this.currentSongId--;
      }
    },
    nextMusic() {
      if (this.currentSongId == this.imgsList.length - 1) {
        this.currentSongId = 0;
      } else {
        this.currentSongId++;
      }
    },
    musicthis(val) {
      this.musicthis = val;
    },
    clear() {
      this.currentSongId = 0;
      this.songsList = [];
      this.imgsList = [];
      this.SongUrl = null;
    },
    addSongUrl(url) {
      this.SongUrl = url
    },
  }
}

export const useMusic = defineStore("music", option)


