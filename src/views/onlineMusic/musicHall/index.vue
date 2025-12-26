<template>
    <div class="musicHall">
        <div class="title">音乐馆</div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="精选" name="first">
                <banner></banner>
                <div class="dujia">
                    <div class="text2">
                        <p>独家放送</p>
                        <span class="iconfont icon-jiantouyou"></span>
                    </div>
                    <dujia></dujia>
                </div>
                <div class="recomMV">
                    <MV></MV>
                </div>
            </el-tab-pane>
            <el-tab-pane label="排行" name="second">
                <paihangVue></paihangVue>
            </el-tab-pane>
            <el-tab-pane label="歌手" name="third">
                <songerVue></songerVue>
            </el-tab-pane>
            <el-tab-pane label="分类歌单" name="forth">
                <fenlei></fenlei>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import MV from '../recommend/MV.vue';
import banner from '../recommend/banner.vue';
import dujia from './dujia.vue';
import radioStationVue from './radioStation.vue';
import fenlei from './fenlei.vue';
import paihangVue from './paihang.vue';
import songerVue from './songer.vue';
import { ref } from 'vue';
let activeName = ref('first')
</script>

<style lang="less" scoped>
.musicHall {
    min-width: 500px;

    .title {
        width: 100%;
        box-sizing: border-box;
        font-weight: 700;
        padding-bottom: 16px;
        font-size: 36px;
        line-height: 36px;
    }

    .text2 {
        height: 52px;
        padding: 12px 0;
        display: flex;
        align-items: center;

        P {
            font-size: 20px;
            line-height: 53px;
        }

    }
}
</style>