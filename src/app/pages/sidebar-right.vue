<template>
  <div class="sidebar-right-box">
    <div class="fixed-box">
      <ul>
        <li v-for="(item, index) in targRecommendMemeList" :key="'recom' + index">
          <a :href="item.link" target="_blank">
            <div class="img-box">
              <img :src="item.imgSrc">
            </div>
            <div class="intro-box">
              <h3>{{item.intro}}</h3>
            </div>
            
          </a>
        </li>
      </ul>
    </div>
   
  </div>
</template>

<script>
  export default {
    name: 'sidebar-right',
    props: {
      fethchResourcesList: Function,
      fetchResourceDetail: Function,
      memeList: Array,
    },
    data (){
      return {
        targRecommendMemeList: [],
        recommendMemeList: [
          // {"link":"https://9gag.com/gag/a7MB2yA?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532946074.5416_UWyHED_300.jpg","intro":"Ryan Reynolds Is Working On An R-Rated, Stoner Version Of 'Home Alone'"},
          // {"link":"https://9gag.com/gag/aMj6LBM?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1533013121.2516_SumU4e_300.jpg","intro":"Relatable."},
          // {"link":"https://9gag.com/gag/aq7O3Wv?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532915148.5408_AvUnym_300.jpg","intro":"Photographer Gets His Dog To Recreate Madonna’s Iconic Photos And He Looks Fabulous"
          // },
          // {"link":"https://9gag.com/gag/aBxz012?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1533107958.8432_u3adu7_300.jpg","intro":"A quick brown fox and a lazy dog."},
          // {"link":"https://9gag.com/gag/aXxzKRg?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532674711.3884_HUNuqE_300.jpg","intro":"Workers Flee For Their Lives From Approaching Friendly Pitbull"},
          // {"link":"https://9gag.com/gag/aMj7KOM?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1533096370.6934_UvuWa6_300.jpg","intro":"Venom Is Really, Really Talkative In New Trailer"},
          // {"link":"https://9gag.com/gag/aN1XOyK?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532927797.4503_zaBU5a_300.jpg","intro":"OUT OF NOWHERE..."},
          // {"link":"https://9gag.com/gag/aZ3Xxv9?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532942367.0395_hudUzY_300.jpg","intro":"Polar Bear Shot Dead After Attacking Guard Helping Tourists Off Arctic Cruise Ship"
          // },
          // {"link":"https://9gag.com/gag/aYgBDR2?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532666773.742_gU2y6y_300.jpg","intro":"Never forget this old prank"},
          // {"link":"https://9gag.com/gag/aKjyZzO?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1533012535.2095_BUWU6a_300.jpg","intro":"No candles please"},
          // {"link":"https://9gag.com/gag/aDx9oyN?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1533107864.0864_aGA8YQ_300.jpg","intro":"This note!"},
          // {"link":"https://9gag.com/gag/a5oAmrr?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532927437.2622_MeXupy_300.jpg","intro":"G(old)."
          // },
          // {"link":"https://9gag.com/gag/a2oVoMe?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532666573.3042_NEREhU_300.jpg","intro":"Not vaccinating your kids?"},
          // {"link":"https://9gag.com/gag/aPj00Lq?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532928305.8231_Xajy2Y_300.jpg","intro":"Weekend is going great"},
          // {"link":"https://9gag.com/gag/ajEv0Vw?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1533002728.534_yJu3YN_300.jpg","intro":"Colored Pencil Nails Are A Thing And They Actually Work"},
          // {"link":"https://9gag.com/gag/am7yn06?ref=fsidebar","imgSrc":"https://miscmedia-9gag-fun.9cache.com/images/featured/1532927407.0365_JE5ENU_300.jpg","intro":"Save a ginger"}
        ]
      }
    },
    methods :{
      loadRecommendMemeListData (type = 'image'){
        this.fethchResourcesList(type, 'recommended')
          .then(res => {
            if(res.errcode == 0 && res.data.length){
              this.targRecommendMemeList = this.recommendMemeList = res.data
                .filter(it => it.status == 3)
                .map(it => {
                  var { presentableId, nodeId, resourceId, userDefinedTags, resourceInfo: { resourceType, meta: { categoryId = '', intro = '' } } } = it
                  var tags = userDefinedTags
                              .filter(it => /^tag-/.test(it))
                              .map(it => {
                                return { name: it.replace('tag-', '') }
                              })
                  var imgSrc = `api/v1/auths/presentable/${presentableId}.data?nodeId=${nodeId}&resourceId=${resourceId}`
                  var link = `/#/meme/${presentableId}`
                  return {
                    type, intro, tags, imgSrc, presentableId, link
                  }
                })
            }
          })
      }
    },
    computed: {
      memeListMap (){
        var tMap = new Map()
        this.memeList.forEach(item => {
          tMap.set(item.src, 1)
        })
        return tMap
      }
    },
    watch :{
      memeList (){
        this.targRecommendMemeList = this.recommendMemeList.filter(it => !this.memeListMap.get(it.imgSrc))
      }
    },
    mounted (){
      this.loadRecommendMemeListData()
    }
  }

</script>

<style scoped>
  .sidebar-right-box{ float: right; width: 300px; padding-left: 32px;  }
  .fixed-box{ position: fixed; top: 24px; bottom: 60px; width: 300px; }
  .sidebar-right-box ul{ overflow-y: scroll; width: 100%; height: 100%; }
  .sidebar-right-box li{ margin-bottom: 8px; }
  .img-box{ display: block; overflow: hidden; position: relative;
    width: 300px; height: 105px; margin-bottom: 4px; border-radius: 2px;
    background-color: #f4f4f4;
  }
  .img-box img{
    display: block;
    width: 100%; margin-top: -26px;border: 0;
  }
  .intro-box h3{
    font-size: 14px; font-weight: normal;
    line-height: 20px; word-wrap: break-word; 
  }
  .sidebar-right-box a{ color: #000; }
  .sidebar-right-box a:hover{ color: #09f; }
</style>



