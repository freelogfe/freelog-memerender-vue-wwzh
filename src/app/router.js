import VueRouter from 'vue-router'
import Vue from 'vue'
import Home from './pages/index'
import MemeDetail from './pages/meme-detail'
import MemeEditor from './pages/meme-editor'
import MemeGenerator from './pages/meme-generator'
Vue.use(VueRouter)


const routes = [{
  path: '/',
  redirect: '/generator',
  component: Home
},{
  path: '/category/:type',
  component: Home,
}, {
  path: '/meme/:presentableId',
  component: MemeDetail
}, {
  path: '/editor',
  component: MemeEditor
}, {
  path: '/generator',
  component: MemeGenerator
}]

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  },
  routes
});


export default router

