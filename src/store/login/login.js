import { defineStore } from "pinia";

const option = {
    // 真正存储数据的地方
    state() {
        return {
            isLogin: false
        }
    },
    actions: {
    }
}

export const useLogin = defineStore("login", option)