webpackJsonp([12],{29:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={}},38:function(e,t,o){t=e.exports=o(2)(),t.push([e.id,"@media screen and (max-width:1024px){#topbar{background-color:#fff;box-shadow:0 1px 6px rgba(0,0,0,.35);position:fixed;top:56px;left:0;right:0;z-index:99}}@media screen and (min-width:1025px){#topbar{background-color:#fff;box-shadow:0 1px 6px rgba(0,0,0,.35);position:fixed;top:64px;left:240px;right:0;z-index:99}}","",{version:3,sources:["/./src/components/reuseable/Topbar.vue"],names:[],mappings:"AACA,qCACE,QACE,sBAAuB,AACvB,qCAAuC,AACvC,eAAgB,AAChB,SAAU,AACV,OAAQ,AACR,QAAS,AACT,UAAW,CACZ,CACF,AACD,qCACE,QACE,sBAAuB,AACvB,qCAAuC,AACvC,eAAgB,AAChB,SAAU,AACV,WAAY,AACZ,QAAS,AACT,UAAW,CACZ,CACF",file:"Topbar.vue",sourcesContent:["\n@media screen and (max-width: 1024px) {\n  #topbar {\n    background-color: #fff;\n    box-shadow: 0 1px 6px rgba(0,0,0,0.35);\n    position: fixed;\n    top: 56px;\n    left: 0;\n    right: 0;\n    z-index: 99\n  }\n}\n@media screen and (min-width: 1025px) {\n  #topbar {\n    background-color: #fff;\n    box-shadow: 0 1px 6px rgba(0,0,0,0.35);\n    position: fixed;\n    top: 64px;\n    left: 240px;\n    right: 0;\n    z-index: 99\n  }\n}\n"],sourceRoot:"webpack://"}])},43:function(e,t,o){var n=o(38);"string"==typeof n&&(n=[[e.id,n,""]]);o(3)(n,{});n.locals&&(e.exports=n.locals)},51:function(e,t){e.exports=" <div id=topbar> <slot></slot> </div> "},53:function(e,t,o){var n,r,i={};o(43),n=o(29),r=o(51),e.exports=n||{},e.exports.__esModule&&(e.exports=e.exports["default"]);var a="function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports;r&&(a.template=r),a.computed||(a.computed={}),Object.keys(i).forEach(function(e){var t=i[e];a.computed[e]=function(){return t}})},363:function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var r=o(53),i=n(r);t["default"]={attached:function(){"/quick-quiz"===this.$route.path&&this.$router.go({name:"prepare-quiz"})},components:{topbar:i["default"]}}},509:function(e,t){e.exports=" <div id=quick-quiz> <topbar> <div class=tabbar> <span class=tabbar-item style=width:50% v-link=\"{ name: 'prepare-quiz', activeClass: 'tabbar-item-active'}\">準備小測</span> <span class=tabbar-item style=width:50% v-link=\"{ name: 'quiz-results', activeClass: 'tabbar-item-active' }\">數據統計</span> </div> </topbar> <router-view :is=view transition=fade transition-mode=out-in style=margin-top:52px keep-alive><router-view> </router-view></router-view></div> "},539:function(e,t,o){var n,r,i={};n=o(363),r=o(509),e.exports=n||{},e.exports.__esModule&&(e.exports=e.exports["default"]);var a="function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports;r&&(a.template=r),a.computed||(a.computed={}),Object.keys(i).forEach(function(e){var t=i[e];a.computed[e]=function(){return t}})}});
//# sourceMappingURL=12.d0768484d97d0792beb9.js.map