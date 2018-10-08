<template>
  <div>
    <sidebar-left 
      ref='sidebarLeft' 
      :popularList="popularList"
      :cateforyList="cateforyList" 
      :selectedIndex.sync="sl_selectedIndex"></sidebar-left>
    <div class="meme-wrapper">
      <div class="content-box">
        <div class="meme-profile" v-if="!!targProfile && targProfile.intro">
          <section class="meme-p-header">
            <div class="img-box">
              <img :src="targProfile.thumbnailSrc" alt="">
            </div>
            <div class="meme-p-info">
              <h2>{{targProfile.name}}</h2>
              <p>{{targProfile.intro}}</p>
            </div>
          </section>
          <div class="meme-tab-bar" v-if="pTabList.length">
            <ul>
              <li 
                :class="{'selected': selectedPTabIndex == index}" 
                v-for="(tab, index) in pTabList" 
                :key="'tab-'+index"
                @click="exchangeProfileTab(index)"
              >{{tab.name}}</li>
            </ul>
          </div>
        </div>
        <div class="meme-list">
          <meme-card :memeItem="item" v-for="(item, index) in memeList" :key="'meme-' + index"></meme-card>
        </div>
      </div>
      
      <sidebar-right
        :fethchResourcesList="fethchResourcesList"
        :fetchResourceDetail="fetchResourceDetail"
        :memeList="memeList" 
      ></sidebar-right>
    </div>
  </div>
  
</template>

<script>
  import sidebarLeft from './sidebar-left.vue'
  import sidebarRight from './sidebar-right.vue'
  import memeCard from '../components/card.vue'
  export default {
    name: 'home-page',
    props: {
      popularList: Array,
      cateforyList: Array,
      selectedIndex: Number,
      fethchResourcesList: Function,
      fetchResourceDetail: Function,
      memeList: Array,
    },
    data (){
      return {
        sl_selectedIndex: -1,
        testMeme:  { 
          type: 'video',
          intro: 'This conference mic on a Pringles box', 
          src: 'https://img-9gag-fun.9cache.com/photo/azXwerN_460sv.mp4' , 
          tags: [ { name: 'Venom', link: '' },{ name: 'billie eilish', link: '' } ] ,
          presentableId: '5b6962cce321dc002caf2f1b'
        },
        pTabList: [
          // { name: 'Hot' },
          // { name: 'Fresh' }
        ],
        selectedPTabIndex: 1,
      }
    },
    methods:{
      exchangeProfileTab (index){
        this.selectedPTabIndex = index 
      },
      loadMemeListData (type = ''){
        this.fethchResourcesList(type, 'categoryid-'+this.targCategoryId)
          .then(res => {
            // console.log(res)
            if(res.errcode == 0){
              res.data = res.data
                .filter(it => it.status == 3)
                .map(it => {
                  var { presentableId, nodeId, resourceId, userDefinedTags, resourceInfo: { resourceType, meta: { categoryId = '', intro = '' } } } = it
                  var tags = userDefinedTags
                              .filter(it => /^tag-/.test(it))
                              .map(it => {
                                return { name: it.replace('tag-', '') }
                              })
					        var src = `api/v1/auths/presentable/${presentableId}.data?nodeId=${nodeId}&resourceId=${resourceId}`
                  return {
                    type: resourceType, intro, tags, src, presentableId
                  }
                })
              this.$emit('update:memeList', res.data)
            }
          })
      },
      getActIndexByPath (path){
        var arr = this.targCategoryList
        var rE = new RegExp(`${path}/?$`)
        var leng = arr.length
        for(var i = 0; i < leng; i++){
          if(rE.test(arr[i].link)){
            this.$emit('update:selectedIndex', i)
            break
          }
        }
        if(i == leng){
          this.$emit('update:selectedIndex', -1)
        }
      }
    },
    computed : {
      targCategoryList (){
        return [...this.popularList, ...this.cateforyList]
      },
      targProfile (){
        return this.targCategoryList[this.selectedIndex]
      },
      targCategoryId (){
        return this.targCategoryList[this.selectedIndex] && this.targCategoryList[this.selectedIndex].categoryId
      },
    },
    watch : {
      sl_selectedIndex (){
        if(this.sl_selectedIndex !== this.selectedIndex){
          this.$emit('update:selectedIndex', this.sl_selectedIndex)
        }
      },
      targCategoryId (){
        this.targCategoryId && this.loadMemeListData()
      }
    },
    components: {
      memeCard, sidebarLeft, sidebarRight
    },
    mounted (){
      this.targCategoryId && this.loadMemeListData()
      this.sl_selectedIndex = this.selectedIndex
    },
    beforeRouteUpdate (to, from, next) {
      this.getActIndexByPath(to.path)
      
      next()
    },
  }
</script>

<style scoped>
  .meme-p-header{ display: flex; align-items: center; margin-bottom: 12px; }
  .meme-p-header .img-box{ overflow: hidden; width: 80px; height: 80px; margin-right: 16px; border-radius: 2px; background-color: rgba(0,0,0,0.1); }
  .meme-p-header .img-box img{ display: block; width: 100%; }
  .meme-p-info { flex: 1; }
  .meme-p-info h2{ font-size: 24px; line-height: 28px; }
  .meme-p-info p{ font-size: 14px; color: #999; }
  .meme-tab-bar { position: relative; width: 100%; margin-bottom: 12px; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);}
  .meme-tab-bar ul{ display: flex; }
  .meme-tab-bar li{ display: block; box-sizing: border-box;
    height: 40px; padding: 10px 16px; line-height: 20px; font-weight: bold; color: #999; cursor: pointer; }
  .meme-tab-bar li.selected { border-bottom: 2px solid #000; font-weight: bold; color: #000; }
  .meme-list .meme-card-box:first-child{ border-width: 0; }
</style>

