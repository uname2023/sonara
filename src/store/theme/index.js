import { defineStore } from "pinia";

const option = {
  // 真正存储数据的地方
  state() {
    return {
      fontColor: "black",
      mainColor: "#f6f6f6",
      catelogueColor: "#f0f0f0",
      imgSrc: "imgs/1001.png",
    }
  },
  actions: {
    changeTheme() {
      this.fontColor = this.fontColor == "black" ? "white" : "black";
      this.mainColor = this.mainColor == "#f6f6f6" ? "#1e1e1f" : "#f6f6f6";
      this.catelogueColor =
        this.catelogueColor == "#f0f0f0" ? "#171718" : "#f0f0f0";
      this.imgSrc =
        this.imgSrc == "imgs/1001.png" ? "imgs/1002.png" : "imgs/1001.png";
    },
  }
}

export const useTheme = defineStore("theme", option)

