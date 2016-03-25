<template>
  <div id="app">
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer
    mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{$route.title}}</span>

        <div class="mdl-layout-spacer"></div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable
        mdl-textfield--floating-label mdl-textfield--align-right">
        <!-- <label class="mdl-button mdl-js-button mdl-button--icon"
        for="fixed-header-drawer-exp">
        <i class="material-icons">search</i>
      </label> -->
      <div class="mdl-textfield__expandable-holder">
        <input class="mdl-textfield__input" type="text" name="sample"
        id="fixed-header-drawer-exp">
      </div>
    </div>
  </div>
</header>
<div class="mdl-layout__drawer">
  <span class="mdl-layout-title">題庫</span>
  <nav class="mdl-navigation">
    <a class="mdl-navigation__link" v-link="{name:'create-question'}">創建題目</a>
    <a class="mdl-navigation__link" v-link="{name:'my-question'}">管理題目</a>
    <a class="mdl-navigation__link" v-link="{name:'my-qcollection'}">管理題集</a>

  </nav>
</div>
<main class="mdl-layout__content">
  <div class="page-content">

    <router-view :is="view" transition="fade" transition-mode="out-in"></router-view>

  </div>
</main>
</div>

<toast :message="toast.message" :show="toast.show"></toast>
</div>
</template>

<script>
import Toast from './components/reuseable/Toast'
import './css/animation.css'

export default {
  data () {
    return {
      toast: {
        message: '',
        show: false
      }
    }
  },
  components: {
    Toast
  },
  events: {
    'show-toast': function (message) {
      if (!this.toast.show) {
        let v = this
        this.toast.message = message
        this.toast.show = true
        setTimeout(function hideToast () {
          v.toast.show = false
        }, 2000)
      }
    }
  }
}
</script>

<style>
html {
  height: 100%;
  background: #eee;
}

body {
  align-items: center;
  justify-content: center;
  height: 100%;
  margin:0
}
</style>
