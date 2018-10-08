<template>
  <div class="sidebar-left-box">
    <div class="srcoll-box">
      <div class="popular-box">
        <header><h3>Popular</h3></header>
        <ul>
          <li 
            :class="{'selected': index == selectedIndex}"
            v-for="(item, index) in popularList" 
            :key="'popularList-'+index"
          >
            <a class="label" :href="'/#' + item.link"><i :class="['icon', item.name]"></i> {{item.name}}</a>
            <a href="" class="button"><i class="icon more"></i> </a>
          </li>
        </ul>
      </div>
      <div class="sections">
        <header><h3>Sections</h3></header>
        <ul>
          <li 
            :class="{'selected': index == selectedIndex - 3}"
            v-for="(item, index) in cateforyList" 
            :key="'cartefory' + index" 
            @click="exchageIndex(index + 3)"
          >
            <a class="label" :href="item.link">
              <i class="thumbnail"><img :src="item.thumbnailSrc" alt=""></i> 
              {{item.name}}
            </a>
            <a href="javascript:;" class="button"><i class="icon star"></i> </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sidebar-left',
    props: {
      popularList: Array,
      cateforyList: Array,
      selectedIndex: Number
    },
    data (){
      return {
        
      }
    },
    methods : {
      exchageIndex (index){
        this.$emit('update:selectedIndex', index)
      }
    },
  }
  
</script>

<style scoped lang='less'>
  .sidebar-left-box{ 
    position: fixed; top: 0; bottom: 60px; z-index: 100; 
    width: 192px; overflow: hidden;
  }
  .srcoll-box{
    overflow-y: scroll;
    width: 100%; height: 100%; padding-top: 24px; padding-right: 20px; 
  }
  .popular-box , .sections{
    padding-bottom: 12px;

    h3 { height: 16px; margin-bottom: 8px;
      font-size: 12px; color: #999;line-height: 16px;}

    li{ position: relative; }

    .label{ 
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      box-sizing: border-box; display: block; position: relative;
      height: 36px; padding: 8px 8px 8px 36px; border-radius: 2px;
      font-size: 14px; line-height: 20px; color: #000;
      transition: background-color 0.15s, padding-right 0.15s;
    }
    li:hover .label {
      background-color: rgba(0,0,0,0.03);
      padding-right: 32px;
    }

    li.selected .label {
      background-color: rgba(0,0,0,0.05);
      font-weight: bold;
    }

    li .button {
      display: block;
      position: absolute; right: 0; top: 0;
      width: 36px; height: 36px;
      opacity: 0; transition: opacity 0.15s;
    }
    li:hover .button {
      opacity: 1;
    }

    .icon{ 
      position: absolute; left: 4px; top: 50%;
      width: 24px; height: 24px; margin-top: -12px; 
      background-size: 264px 48px;  background-image: url('https://assets-9gag-fun.9cache.com/s/fab0aa49/2b0fee393147eb35aa5ff41c646c1042e71a9934/static/dist/web6/img/post-action-sprite.png');

      &.Hot{ background-position: -168px 0; }
      &.Trending{ background-position: -192px 0; }
      &.Fresh{ background-position: -216px 0; }
      &.more{ opacity: 0.4; left: 6px; background-position: -72px 0; }
      &.star{opacity: 0.4; left: 6px; background-position: -240px 0;  }
    }

    

    .thumbnail{
      overflow: hidden;
      position: absolute; left: 4px; top: 50%;
      width: 24px; height: 24px; margin-top: -12px; 
      background-color: rgba(0,0,0,0.05); border-radius: 2px;

      img{ display: block; width: 100%; }
    }
  }
  
   
    
</style>

