<template>
  <div>
    <sidebar-left 
      ref='sidebarLeft' 
      :popularList="popularList"
      :cateforyList="cateforyList" 
      :selectedIndex.sync="selectedIndex"></sidebar-left>
    <div class="meme-wrapper">
      <div class="content-box">
        <div class="meme-detail-box" v-if="meme != null">
          <div class="meme-db-header">
            <h1>{{meme.name}}</h1>
            <div class="meme-db-meta" v-if="targPointCount != ''">
              <router-link to="">
                <span>{{targPointCount}} points</span>
              </router-link>
            </div>
          </div>
          <div class="meme-cb-tags">
              <router-link to="" v-for="(tag, index) in meme.tags" :key="'tag' + index">
                  <span class="meme-cb-tag">{{tag.name}}</span>
              </router-link>
          </div>
          <div class="meme-db-btn-box">
            <div class="fixed-box">
              
              <div class="meme-db-bb-left-box">
                <points :pointCount.sync="pointCount" :presentableId="meme.presentableId"></points>
              </div>
              
              <div class="btn-next-post">
                <a href="javascript:void(0)" role="button" rel="nofollow" class="next">
                  <span class="label">Next Post</span>
                  <span class="arrow"></span>
                </a>
              </div>
            </div>
          </div>
          <div class="meme-media-box">
              <img v-if=" meme.type == 'image' " :src="meme.src" alt="" class="" />
          </div>
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
  import * as utils from '../modules/utils'
  import points from '../components/points'
  import sidebarLeft from './sidebar-left.vue'
  import sidebarRight from './sidebar-right.vue'

  export default {
    name: 'meme-detail',
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
        meme: null,
        pointCount: 0,
        // meme: {
        //   name: 'Good people never die',
        //   pointCount: 43002,
        //   src: 'https://img-9gag-fun.9cache.com/photo/am7QxV9_460s.jpg',
        //   type: 'image',
        //   tags: [ { name: 'Venom', link: '' },{ name: 'billie eilish', link: '' } ] 
        // }
      }
    },
    methods: {
			fetchPresentableDetail (presentableId){
				return window.QI.fetch(`/v1/presentables/${presentableId}`)
								.then(resp => resp.json())
      },
      
    },
    computed: {
      targPointCount (){
        if(typeof this.pointCount != 'undefined'){
          return this.pointCount.toString().replace(/(?=(?!^)(\d{3})+$)/g, ',')
        }else{
          return ''
        }
      }
    },
    mounted (){
      var { presentableId } = this.$route.params
      this.fetchPresentableDetail(presentableId)
        .then(res => {
          if(res.errcode == 0 && res.data){
            var { presentableId, nodeId, resourceId, userDefinedTags, resourceInfo: { resourceType, meta: { categoryId = '', intro = '' } } } = res.data
            var tags = userDefinedTags
                        .filter(it => /^tag-/.test(it))
                        .map(it => {
                          return { name: it.replace('tag-', '') }
                        })
            var src = `api/v1/auths/presentable/${presentableId}.data?nodeId=${nodeId}&resourceId=${resourceId}`
                  
            this.meme = {
              name: intro,
              src,
              type: resourceType,
              tags,
              presentableId,
            }
          }
        })
    },
    components: {
      points, sidebarLeft, sidebarRight
    },
    beforeRouteUpdate (to, from, next) {
      console.log(to, from)
      next()
    }
  }
</script>

<style scoped lang="less">
    .meme-db-header{  
      position: relative;
      margin-bottom: 6px;

      h1{
        font-size: 24px; line-height: 28px; word-wrap: break-word;
      }
    }

    .meme-db-meta { 
      margin-bottom: 12px; color: #999;  
      
      a{ font-size: 13px; color: #999; }
      a:hover { color: #666; }
    }

    .meme-cb-tags{ 
      width: 500px; line-height: 24px;
      
      .meme-cb-tag{ margin-right: 8px; color: #09f; font-size: 14px; font-weight: bold; }
      .meme-cb-tag:hover{ color: #33adff; }
    }
    
    
    .meme-db-btn-box{ 
      height: 40px; padding: 10px 0;
      
      .fixed-box{  }
      .meme-db-bb-left-box{ float: left; }

      .btn-next-post{
        float: right;

        .next{ position: relative; display: block; padding-right: 12px; }
        .label{
          display: block; height: 34px; padding: 0 8px 0 12px; border-radius: 3px 0 0 3px;
          font-weight: bold; line-height: 34px; background-color: #ff3c1f; color: #fff;
        }
        .arrow{
          position: absolute; top: 0; right: 0;
          display: block; width: 0; height: 0;
          border-top: 17px dashed transparent; border-bottom: 17px dashed transparent; border-left: 12px solid #ff3c1f;
        }
      }
    }

    .meme-media-box { 
      min-height: 200px; margin-bottom: 8px; 
      img{ display: block; width: 600px; margin: auto; }
    }
      
</style>

