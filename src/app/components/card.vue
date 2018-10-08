<template>
    <div class="meme-card-box">
        <router-link :to="targPath">
            <h2 class="meme-cb-intro">{{memeItem.intro}}</h2>
        </router-link>
        <div class="meme-media-box">
            <router-link :to="targPath" v-if=" memeItem.type == 'image' ">
                <img :src="memeItem.src" alt="" class="" />
                
            </router-link>
            <video v-else-if=" memeItem.type == 'video'" :src="memeItem.src" preload="auto" controls="controls"></video>
        </div>
        <div class="meme-cb-tags">
            <router-link to="" v-for="(tag, index) in memeItem.tags" :key="'tag' + index">
                <span class="meme-cb-tag">{{tag.name}}</span>
            </router-link>
        </div>
        <div class="meme-meta">
            <span>{{pointCount}} points</span>
        </div>
        <div class="btn-box">
            <points :pointCount.sync="pointCount" :presentableId="memeItem.presentableId"></points>
        </div>
    </div>
</template>

<script>
    import points from './points'
    export default {
        name: 'meme-card',
        props: {
            memeItem: Object,
        },
        components: { points },
        data (){
            return {
                pointCount: 0
            }
        },
        computed : {
            targPath (){
                return `/meme/${this.memeItem.presentableId}`
            }
        },
        methods :{
            
        },
        mounted (){
            
        }
    }
</script>

<style scoped>
    .meme-card-box{ margin-bottom: 24px; border-top: 1px solid rgba(0,0,0,0.1); padding: 20px 0 0; box-sizing: border-box; }
    .meme-cb-intro{ margin-bottom: 8px; font-size: 20px; color: #222; word-wrap: break-word; }
    .meme-media-box { width: 500px; min-height: 200px; margin-bottom: 8px; }
    .meme-media-box img{ display: block; width: 100%; }
    .meme-cb-tags{ width: 500px; line-height: 24px; margin-bottom: 4px; }
    .meme-cb-tag{ margin-right: 8px; color: #09f; font-size: 14px; font-weight: bold; }
    .meme-cb-tag:hover{ color: #33adff; }
    .meme-meta { margin-bottom: 12px; color: #999;  }
    .meme-meta a{ font-size: 13px; color: #999; }
    .meme-meta a:hover { color: #666; }
    .btn-box{ display: flex; }
    .btn-vote { 
       position: relative; display: block; box-sizing: border-box;
       width: 44px; height: 34px; margin-right: 8px; border: 1px solid #ccc; border-radius: 2px; cursor: pointer;
    }
    .btn-vote::after{
        position: absolute; left: 50%; top: 50%; content: ' '; 
        width: 30px; height: 30px; margin-left: -15px; margin-top: -15px; 
        background: url('https://assets-9gag-fun.9cache.com/s/fab0aa49/2b0fee393147eb35aa5ff41c646c1042e71a9934/static/dist/web6/img/sprite.png') no-repeat; background-size: 510px 120px;
    }
    .btn-vote-up::after{ background-position: -120px 0; }
    .btn-vote-down::after{ background-position: -150px 0; }
    .btn-vote:hover{ border-color: #333; }
</style>