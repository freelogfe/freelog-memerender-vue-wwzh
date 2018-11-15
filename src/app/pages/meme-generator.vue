<template>
  <div v-if="imgArr.length">
    <div class="meme-generator-box">

      <div class="img-list">
        <h3>选择底图</h3>
        <div class="img-wrapper">
          <div
            class="img-item"
            :class="{ 'active': actImgIndex === index }"
            v-for="(item, index) in imgArr"
            :key="'img' + index"
            @click="exchangeImg(index)"
          >
            <img :src="imgArr[index].src" alt=""/>
          </div>
        </div>
      </div>
      <div class="meme-img-intro">

      </div>
      <div class="meme-g-cont">
        <div class="img-display-box">
          <img :src="imgArr[actImgIndex].src" alt=""/>
          <div
            :class="['img-info']"
            v-for="(info, index) in infoArr" :key="'tab' + index"
            :style="infoStyleArr[index]"
          >
            {{info}}
          </div>
        </div>
        <div class="meme-editor-box">
          <div class="name-box">
            <textarea class="form-control" type="text" rows="4" v-model="infoArr[0]"/>
            <div class="name-size">
              <span class="minus" @click="minusInfoSize(0)">-</span>
              <span class="plus" @click="plusInfoSize(0)">+</span>
            </div>
          </div>
          <div class="name-box">
            <textarea class="form-control" type="text" rows="4" v-model="infoArr[1]"/>
            <div class="name-size">
              <span class="minus" @click="minusInfoSize(1)">-</span>
              <span class="plus" @click="plusInfoSize(1)">+</span>
            </div>
          </div>
          <div class="btn-box">
            <button class="mbb-create-btn" @click="createMeme">create meme</button>
          </div>
        </div>
      </div>

      <div class="meme-showed-box" v-if="targMeme != ''">
        {{targMeme}}
      </div>
    </div>
    <div class="meme-message-box" v-if="isShowMsgBox">
      {{msg}}
    </div>
    <a ref="newWindowLink" href="javascript:void(0);" target="_blank" v-show="false"></a>
  </div>

</template>

<script>
  export default {
    name: 'meme-generator',
    props: {
      fethchResourcesList: Function
    },
    data() {
      return {
        isShowMsgBox: false,
        msg: 'fsafa 副书记',
        actImgIndex: 0,
        imgArr: [],
        actTabIndex: 0,
        infoArr: [
          '这是头部占位文案！！！', '我也是底部占位文案！！！'
        ],
        targFontColor: '#ffffff',
        fontSizeArr: ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '40px', '44px', '48px'],
        infoStyleArr: [
          {
            left: '2%', top: '12px',
            width: '96%',
            fontSize: '24px', color: '#ffffff', textAlign: 'center'
          },
          {
            left: '2%', bottom: '12px',
            width: '96%',
            fontSize: '32px', color: '#ffffff', textAlign: 'center'
          }
        ],
        targMeme: ''
      }
    },
    methods: {
      exchangeTab(index) {
        this.actTabIndex = index
      },
      createMeme() {

        var desc = []
        this.infoStyleArr.forEach((item, index) => {
          var temp = {}
          temp.name = this.infoArr[index]
          temp.position = {
            left: item.left,
            top: item.top,
            bottom: item.bottom,
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
            {"resourceId": this.imgArr[this.actImgIndex].resourceId}
          ],
          "descriptions": desc
        })

        this.uploadMeme()
          .then(sha1 => this.createMemeResource(sha1))
          .then(res => {
            if(res.errcode === 0){
              this.$refs.newWindowLink.setAttribute('href', `http://console.testfreelog.com/resource/edit/${res.data.resourceId}`)
              this.$refs.newWindowLink.click()

              this.showMsgBox('meme 创建成功！！！')
            }else{
              this.showMsgBox(`meme 创建失败，error:${res.msg}`)
            }
          })
      },
      uploadMeme() {
        var formdata = new FormData()
        formdata.append('resourceType', 'json',)
        formdata.append("file", new Blob([this.targMeme], {type: "application/json"}))
        return window.FreelogApp.QI.fetch(`/v1/resources/uploadResourceFile`, {
          method: 'post',
          data: formdata
        })
          .then(resp => resp.json())
          .then(res => {
            if (res.errcode === 0 && res.data && res.data.sha1) {
              return Promise.resolve(res.data.sha1)
            } else {
              return Promise.reject(res)
            }
          })
      },
      createMemeResource(sha1) {
        var resourceId = this.imgArr[this.actImgIndex].resourceId
        return window.FreelogApp.QI.fetch(`/v1/resources`, {
          method: 'post',
          data: {
            sha1,
            resourceName: `meme-${+new Date()}`,
            meta: {
              "dependencies": [
                resourceId
              ]
            }
          }
        })
          .then(resp => resp.json())
      },
      exchangeImg(index) {
        this.actImgIndex = index
      },
      minusInfoSize (actInfoIndex){
        const curFontSize = this.infoStyleArr[actInfoIndex].fontSize
        var index = this.fontSizeArr.indexOf(curFontSize)
        index--
        index = index < 0 ? 0 : index
        this.infoStyleArr[actInfoIndex].fontSize = this.fontSizeArr[index]
      },
      plusInfoSize (actInfoIndex){
        const curFontSize = this.infoStyleArr[actInfoIndex].fontSize
        var index = this.fontSizeArr.indexOf(curFontSize)
        index++
        index = index == this.fontSizeArr.length ? index - 1 : index
        this.infoStyleArr[actInfoIndex].fontSize = this.fontSizeArr[index]
      },
      showMsgBox (msg){
        this.isShowMsgBox = true
        this.msg = msg
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.isShowMsgBox = false
        }, 2000)
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.fethchResourcesList('image')
        .then(res => {
          console.log("res --", res)
          if (res.errcode == 0 && res.data.length) {
            this.imgArr = res.data.map(item => {
              const {presentableId, resourceId, nodeId} = item
              return {
                src: `/api/v1/auths/presentable/${presentableId}.data?nodeId=${nodeId}&resourceId=${resourceId}`,
                resourceId
              }
            })
          }
        })
    },
    destroyed (){
      clearTimeout(this.timer)
    }
  }

</script>

<style scoped lang="less" type="text/less">
  .meme-generator-box {
    width: 960px;
    min-height: 420px;
    margin: auto;
    background-color: #fff;
    align-items: center;

  }

  .img-list {
    position: relative;
    margin-bottom: 5px;

    h3 {
      margin: 20px 0 5px 0;
      font-size: 16px;
    }

    .img-wrapper {
      display: flex;
      height: 180px;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      cursor: pointer;

      .img-item {
        overflow: hidden;
        display: inline-block;
        min-width: 120px;
        width: 120px;
        height: 120px;
        transition: all .3s;
        align-self: center;

        &.active{
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }

        &.active, &:hover{
          min-width: 160px;
          width: 160px;
          height: 160px;
        }
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .img-item:not(:first-child) {
        margin-left: 5px;
      }
    }
  }

  .meme-img-intro{
    padding: 10px 0;
    font-size: 22px;
    font-weight: bold;
  }

  .meme-g-cont{
    display: flex;

    .img-display-box {
      position: relative;
      min-width: 600px;
      width: 600px;

      img {
        display: block;
        width: 100%;
      }
      .img-info {
        position: absolute;
        left: 2%;
        z-index: 100;
        width: 96%;
      }
    }

    .meme-editor-box{
      flex: 1;
      padding-left: 20px;

      .name-box{
        overflow: hidden;
        margin-bottom: 15px;

        .name-size{
          float: right;
          margin-top: 10px;
          border: 1px solid #c2c2c2;
          border-radius: 2px;

          .minus, .plus{
            display: inline-block;
            padding: 3px 12px;
            cursor: pointer;
            color: #c2c2c2;
            font-size: 20px;

            &:hover, &:focus{
              color: #222;
            }
          }
        }
      }

      .btn-box {
        width: 100%;
        text-align: right;

        .mbb-create-btn {
          display: inline-block;
          width: 100%;
          margin-bottom: 0;
          padding: 6px 12px;
          border: 1px solid #1a97ff;
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.42857143;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          touch-action: manipulation;
          cursor: pointer;
          user-select: none;
          background-image: none;
          background-color: #1a97ff;
          color: #ffffff;
        }
      }
    }
  }

  .form-control {
    box-sizing: border-box;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 2px;
    font-size: 14px;
    color: #555;
    background-color: #fff;
    background-image: none;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;

    &:focus {
      border-color: #66afe9;
      outline: 0;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    }
  }

  textarea.form-control {
    height: auto;
    vertical-align: middle;
  }

  .meme-showed-box {
    margin-top: 15px;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  .meme-message-box{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    min-width: 300px;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    font-size: 16px;
    text-align: center;
    transform: translateX(-50%) translateY(-50%);
  }
</style>



