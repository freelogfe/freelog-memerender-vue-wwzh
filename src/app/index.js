import Vue from 'vue'
import router from './router'
import './index.less'
import App from './pages/app'

var template = require('./index.html');

class FreelogMemerenderVueWwzh extends HTMLElement {
  constructor() {
    super()
  }


  initApp() {
    var app = new Vue({
      el: '#freelog-memerender-vue-wwzh-app',
      router,
      template: '<App/>',
      components: {App}
    })
  }

  connectedCallback() {
    this.innerHTML = template
    this.initApp()
  }
}


customElements.define('freelog-memerender-vue-wwzh', FreelogMemerenderVueWwzh);
