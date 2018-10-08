<template>
  <div v-if="imgArr.length">
    <div class="meme-editor-box">
      <div class="img-display-box">
        <img :src="imgArr[actImgIndex].src" alt="" />
        <div 
          :class="['img-info']" 
          v-for="(info, index) in infoArr" :key="'tab' + index"
          :style="infoStyleArr[index]"
        >
          {{info}}
        </div>
      </div>
      <div class="img-editor-box">
        <div class="img-list">
          <h3>选择底图</h3>
          <div class="img-wrapper">
            <div 
              class="img-item"
              v-for="(item, index) in imgArr" 
              :key="'img' + index" 
              @click="exchangeImg(index)"
            >
              <img :src="imgArr[index].src" alt="" />
            </div>
            
          </div>
            
        </div>
        <div class="tab-box">
          <ul>
            <li 
              :class="{'active': actTabIndex == index}" v-for="(info, index) in infoArr" 
              :key="'tab' + index"
              @click="exchangeTab(index)"
            >{{'文案' + (index + 1)}}</li>
          </ul>
        </div>
        <div class="tab-content">
          <div class="tc-row-box name-box">
            <div class="nb-leftbox">
              <label for="i-name">名称</label>
              <textarea class="form-control" type="text" rows="4" id="i-name" v-model="infoArr[actTabIndex]" />
            </div>
            
          </div>
          <div class="tc-row-box position-box" v-if="false">
            <div class="pb-left-box">
              <label for="i-pLeft">左偏移量(%)</label>
              <input class="form-control" type="text" id="i-pLeft" v-model="infoStyleArr[actTabIndex].left" />
            </div>
            <div class="pb-right-box">
              <label for="i-pRight">上偏移量(%)</label>
              <input class="form-control" type="text" id="i-pRight"  v-model="infoStyleArr[actTabIndex].top"/>
            </div>
          </div>
          <div class="tc-row-box size-box" v-if="false">
            <div class="sb-left-box">
              <label for="i-sWidth">宽度(%)</label>
              <input class="form-control" type="text" id="i-sWidth"  v-model="infoStyleArr[actTabIndex].width"/>
            </div>
            <div class="sb-right-box">
              <label for="i-sHeight">高度(%)</label>
              <input class="form-control" type="text" id="i-sHeight"  v-model="infoStyleArr[actTabIndex].height"/>
            </div>
          </div>
          <div class="tc-row-box font-style-box">
            <div class="fsb-left-box">
              <label for="i-fsFontSize">字体大小</label>
              <select class="form-control" id="i-fsFontSize" v-model="infoStyleArr[actTabIndex].fontSize" >
                <option v-for="(oV, index) in fontSizeArr" :key="'fs' + index">{{oV}}</option>
              </select>
            </div>
            <div class="fsb-right-box">
              <label for="i-fsTextAlign">字体对齐方向</label>
              <select class="form-control" id="i-fsTextAlign"  v-model="infoStyleArr[actTabIndex].textAlign">
                <option v-for="(oV, index) in fontTextAlignArr" :key="'fta' + index">{{oV}}</option>
              </select>
            </div>
          </div>
          <div class="tc-row-box font-style-box" v-if="false">
            <div class="fsb-left-box">
              <label for="i-fsColor">字体颜色</label>
              <input class="form-control" type="text" id="i-fsColor"  v-model="infoStyleArr[actTabIndex].color"/>
            </div>
          </div>
        </div>
        <div class="meme-btn-box">
          <button class="mbb-create-btn" @click="createMeme">create meme</button>
        </div>
      </div>
    </div>
    <div class="meme-showed-box" v-if="targMeme != ''">
      {{targMeme}}
    </div>
  </div>
  
</template>

<script>
  export default {
    name: 'meme-editor',
    props: {
      fethchResourcesList: Function
    },
    data (){
      return {
        actImgIndex: 0,
        imgArr: [],
        actTabIndex: 0,
        infoArr: [
          '这是占位文案！！！', '我也是占位文案！！！'
        ],
        targFontColor: '#ffffff',
        fontSizeArr: ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px', '48px'],
        fontTextAlignArr: [ 'left', 'center', 'right' ],
        infoStyleArr : [
          {
              left: '2%', top: '5%',
              width: '96%', height: '',
              fontSize: '24px', color: '#ffffff', textAlign: 'center'
          },
          {
            left: '2%', top: '80%',
            width: '96%', height: '',
            fontSize: '32px', color: '#ffffff', textAlign: 'center'
          }
        ],
        targMeme: ''
      }
    },
    methods :{
      exchangeTab (index){
        this.actTabIndex = index
      },
      createMeme (){
        var desc = []
        this.infoStyleArr.forEach((item, index) => {
          var temp = {}
          temp.name = this.infoArr[index]
          temp.position = {
            x: item.left,
            y: item.top
          }
          temp.size = {
            width: item.width,
            height: item.height
          }
          temp.fontSize = item.fontSize
          temp.color = item.color
          temp.textAlign = item.textAlign
          desc[index] = temp
        })
        this.targMeme = JSON.stringify({ 
          "dependencies": [
            { "resourceId": this.imgArr[this.actImgIndex].resourceId }
          ],
          "descriptions": desc 
        })

        this.uploadMeme()
          .then(sha1 => this.createMemeResource(sha1))
          .then(res => {
            console.log(res)
          })
      },
      uploadMeme (){
        var formdata = new FormData()
        formdata.append('resourceType', 'json',)
        formdata.append("file", new Blob([this.targMeme], {type: "application/json"}))
        return window.FreelogApp.QI.fetch(`/v1/resources/uploadResourceFile`, {
          method: 'post',
          data: formdata
        })
        .then(resp => resp.json())
        .then(res => {
          if(res.errcode === 0 && res.data && res.data.sha1){
            return Promise.resolve(res.data.sha1)
          }else{
            return Promise.reject(res)
          }
        })
      },
      createMemeResource (sha1){
        var resourceId = this.imgArr[this.actImgIndex].resourceId
        return window.FreelogApp.QI.fetch(`/v1/resources`, {
          method: 'post',
          data: {
            sha1, 
            resourceName: `meme-demo-${+new Date()}`,
            meta: {
              "dependencies": [
                resourceId
              ]
            }
          }
        })
        .then(resp => resp.json())
      },
      exchangeImg (index){
        this.actImgIndex = index
      }
    },
    computed: {
      
    },
    watch :{
      
    },
    mounted (){
      this.fethchResourcesList('image')
        .then(res => {
          console.log("res --", res)
          if(res.errcode == 0 && res.data.length){
            this.imgArr = res.data.map(item => {
              const { presentableId, resourceId, nodeId } = item
              return {
                src: `/api/v1/auths/presentable/${presentableId}.data?nodeId=${nodeId}&resourceId=${resourceId}`,
                resourceId
              }
            })
          }
        })
    }
  }

</script>

<style scoped lang="less">
  .meme-editor-box{
    display: flex; min-height: 420px; background-color: #fff;
    align-items: center;
  }

  .img-display-box { 
    position: relative;
    min-width: 500px;  width: 500px;

    img { display: block; width: 100%; }
    .img-info { 
      position: absolute; left: 2%; z-index: 100; 
      width: 96%; 
    }
  }

  .img-editor-box{
    flex: 1; position: relative; 
    padding-left: 20px; background-color: #fff;

    .img-list{
      position: relative; margin-bottom: 150px;
      h3{ font-size: 16px; }

      .img-wrapper{
        position: absolute; top: 35px; left: 0; right: 0; z-index: 100;
        white-space: nowrap; overflow-x: auto; overflow-y: hidden; cursor: pointer;

        .img-item { overflow: hidden; display: inline-block; width: 120px; height: 120px }
        img{ 
          display: block; width: 100%; 
          position: relative; top: 50%; transform: translateY(-50%); 
        }
        .img-item:not(:first-child){ margin-left: 5px;  }
      }
    }

    .tab-box{
      position: relative;

      ul{
        display: flex;
        margin-bottom: 20px; padding: 0 10px; border-bottom: 1px solid #ccc; 
        text-align: center;
      }

      li{ padding: 6px 20px; color: #666; }
      li.active{
        position: relative; top: 1px;
        border: 1px solid #ccc; border-bottom-width: 0; border-top-left-radius: 6px; border-top-right-radius: 6px;background-color: #fff; color: #dc3f2b;
      }
    }

    .tab-content{
      label{ display: inline-block; width: 100px; text-align: right; font-size: 13px; }
      .form-control{
        box-sizing: border-box;
        width: 210px; height: 34px; padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px;
        font-size: 14px; color: #555; background-color: #fff; background-image: none;
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;

        &:focus{
          border-color: #66afe9; outline: 0; box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
        }
      }
      textarea.form-control {
        height: auto; vertical-align: middle;
      }
      #i-name{ width: 525px; }

      .tc-row-box {
        margin-bottom: 10px;
      }

      .position-box, .size-box, .font-style-box{
        display: flex;
      }

    }

    .meme-btn-box{
      text-align: right;

      .mbb-create-btn{
        display: inline-block;
        margin-bottom: 0; padding: 6px 12px; border: 1px solid #1a97ff; border-radius: 4px;
        font-size: 14px; font-weight: 400; line-height: 1.42857143; text-align: center;
        white-space: nowrap; vertical-align: middle;
        touch-action: manipulation; cursor: pointer; user-select: none;
        background-image: none; background-color: #1a97ff; color: #ffffff;
      }
    }
    
  }

  .meme-showed-box{
    margin-top: 15px;
    padding: 20px; border-radius: 6px; border: 1px solid #ccc;
  }
  
</style>



