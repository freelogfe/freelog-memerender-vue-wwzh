<template>
  <div class="meme-container">
    <router-view 
      :fethchResourcesList="fethchResourcesList"
      :fetchResourceDetail="fetchResourceDetail"
      :popularList="popularList"
      :cateforyList="cateforyList" 
      :memeList.sync="memeList" 
      :selectedIndex.sync="selectedIndex"></router-view>
  </div>
</template>

<script>
  import sidebarLeft from './sidebar-left.vue'
  import sidebarRight from './sidebar-right.vue'
  export default {
    name: 'app',
    data (){
      return {
        popularList: [
          { link:'/category/hot', name: 'Hot', categoryId: '001' }, 
          { link:'/category/trending', name: 'Trending', categoryId: '002' }, 
          { link:'/category/fresh', name: 'Fresh', categoryId: '003' }, 
        ],
        cateforyList: [],
        selectedIndex: -1,
        memeList: []
      }
    },
    components: {
      sidebarRight, sidebarLeft
    },
    computed: {

      targCategoryList (){
        return [...this.popularList, ...this.cateforyList]
      },
    },
    methods :{
      fethchResourcesList (type = '', tags = ''){
        var tagsQueryStr = '', targTypeStr = ''
        if(tags != ''){
          tagsQueryStr = `&tags=${tags}`
        }
        if(type != ''){
          targTypeStr = `&resourceType=${type}`
        }
				return window.FreelogApp.QI.fetch(`/v1/presentables?nodeId=${window.__auth_info__.__auth_node_id__}&isOnline=1${targTypeStr}${tagsQueryStr}`)
				.then(resp => resp.json())
			},

			fetchResourceDetail (presentableId, resourceId){
				return window.FreelogApp.QI.fetch(`/v1/auths/presentable/${presentableId}.info?nodeId=${window.__auth_info__.__auth_node_id__}&resourceId=${resourceId}`)
								.then(resp => resp.json())
			},
      getActIndexByPath (path){
        var rE = new RegExp(`${path}/?$`)
        var leng = this.targCategoryList.length
        for(var i = 0; i < leng; i++){
          if(rE.test(this.targCategoryList[i].link)){
            this.selectedIndex = i
            break
          }
        }
      }
    },
    mounted (){
      
      this.fethchResourcesList('json')
        .then(res => {
          if(res.errcode == 0 && res.data.length ){
            var presentable = res.data[0]
            const { meta } = presentable.resourceInfo
            this.cateforyList = meta.cateforyList.map(it => {
              it.name = decodeURIComponent(it.name)
              return it
            })
            this.getActIndexByPath(this.$route.path)
          }
        })
    }
  }
</script>

<style lang="less">
  .meme-container { overflow: hidden; position: relative; width: 1196px; margin: auto; padding: 24px 16px; background: #fff; }
  .meme-wrapper{ overflow: hidden; width: 972px; margin: 0 0 32px 224px; }
  .meme-wrapper .content-box{ float: left; width: 640px; }
</style>
