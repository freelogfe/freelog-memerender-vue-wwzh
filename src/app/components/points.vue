<template>
    <div>
        <div
            :class="{'btn-vote btn-vote-up': true, 'active': userPointCount >= 1}" 
            @click="addFav"
        ></div>
        <div 
            :class="{'btn-vote btn-vote-down': true, 'disabled': userPointCount == 0}" 
            @click="delFav"
        ></div>
        <loading v-if="isShowLoading" />
    </div>
</template>

<script>
    import * as utils from '../modules/utils'
    import loading from './loading'
  export default {
    name: 'meme-detail',
    props: {
      pointCount: Number,
      presentableId: String
    },
    components: { loading },
    data (){
      return {
        isShowLoading: false,
        userPointCount: 0 
      }
    },
    methods: {
      createPoints (key){
        return window.QI.fetch(`/v1/customStores`, {
                  method: 'POST',
                  data: {
                    key,
                    nodeId: window.__auth_info__.__auth_node_id__,
                    value: { pointCount: 0 },
                  }
                })
                .then(resp => resp.json())
                .then(res => {
                  if(res.errcode == 0){
                    return Promise.resolve(0)
                  }else{
                    return Promise.reject()
                  }
                })
      },
      getPoints (key){
        return window.QI.fetch(`/v1/customStores/${key}`)
                .then(resp => resp.json())
                .then(res => {
                    var pointCount = 0
                    if(res.errcode == 0){
                        if(res.data == null){
                            return this.createPoints(key)
                        }else {
                            pointCount = res.data.value.pointCount
                        }
                    }
                    return Promise.resolve(pointCount)
                })
      },
      getTotalPoints (){
        return this.getPoints(this.totalPointsKey)
                .then(pointCount => this.$emit('update:pointCount', pointCount) )
      },
      getUserPoints (){
        return this.getPoints(this.userPointsKey)
                .then(pointCount => {
                    this.userPointCount = pointCount
                })
      },
      savePoints (key, value){
        return window.QI.fetch(`/v1/customStores/${key}`, {
                method: 'PUT',
                data: {
                value: { pointCount: value }
                }
            })
            .then(resp => resp.json())
      },
      saveTotalPoints (targPoints){
        return this.savePoints(this.totalPointsKey, targPoints)
      },
      saveUserPoints (targPoints){
        return this.savePoints(this.userPointsKey, targPoints) 
      },
      addFav (){
        this.isShowLoading = true
        this.userPointCount += 1
        
        this.$emit('update:pointCount', this.pointCount + 1)
        Promise.race([ this.saveTotalPoints(this.pointCount + 1, this.saveUserPoints(this.userPointCount)) ])
            .then(() =>  {
                this.isShowLoading = false
            })
      },
      delFav (){
        this.isShowLoading = true
        this.userPointCount -= 1
        this.$emit('update:pointCount', this.pointCount - 1)
        Promise.race([ this.saveTotalPoints(this.pointCount - 1, this.saveUserPoints(this.userPointCount)) ])
            .then(() =>  {
                this.isShowLoading = false
            })
      },
      
    },
    computed: {
      totalPointsKey (){
        return `node_${window.__auth_info__.__auth_node_id__}_${this.presentableId}`
      },
      userPointsKey (){
        var userId = utils.getUserId()
        return `node_${window.__auth_info__.__auth_node_id__}_${this.presentableId}_${userId}`
      },
    },
    mounted () {
        this.getTotalPoints()
        this.getUserPoints()
    }
  }
</script>


<style scoped>
    .btn-vote { 
        position: relative; display: inline-block; box-sizing: border-box;
        width: 44px; height: 34px; margin-right: 8px; border: 1px solid #ccc; border-radius: 2px; cursor: pointer;
    }

    .btn-vote::after{
        position: absolute; left: 50%; top: 50%; content: ' '; 
        width: 30px; height: 30px; margin-left: -15px; margin-top: -15px; 
        background: url('https://assets-9gag-fun.9cache.com/s/fab0aa49/2b0fee393147eb35aa5ff41c646c1042e71a9934/static/dist/web6/img/sprite.png') no-repeat; background-size: 510px 120px;
    }
    .btn-vote.disabled{ cursor: not-allowed; }
    .btn-vote-up.active, .btn-vote-up.active:hover{ border-color: #09f; }
    .btn-vote-up.active::after{ background-position: -120px -90px; }
    .btn-vote-up::after{ background-position: -120px 0; }
    .btn-vote-down::after{ background-position: -150px 0; }
    .btn-vote:hover{ border-color: #333; }
</style>

