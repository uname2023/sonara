import { defineStore } from "pinia";

const option = {
  // 真正存储数据的地方
  state() {
    return {
    }
  },
  actions: {
  }
}

export const useSongTable = defineStore("songTable", option)