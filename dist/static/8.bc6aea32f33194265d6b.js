webpackJsonp([8],{28:function(n,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]={data:function(){return{spinnerActive:!0,myQcollections:[],loadMore:!1}},props:["show","qid"],methods:{closeModal:function(){this.show=!1},saveOneToCollection:function(n){if(n&&this.qid){var e={qcollection_id:n,question_id:this.qid};this.$http.post("/api/manage-qcollection/qcollection/question",e).then(function(n){this.show=!1,this.$showToast("添加成功")},function(n){this.$showToast("失敗"+n.data)})}else this.$showToast("發生錯誤")},getMyQcollectionLists:function(){0===this.myQcollections.length&&this.$http.get("/api/manage-qcollection/qcollections/mine").then(function(n){this.spinnerActive=!1,n.data.length>0?(this.myQcollections=n.data,n.data.length<12?this.loadMore=!1:this.loadMore=!0):this.loadMore=!1},function(n){this.spinnerActive=!1,this.loadMore=!1,console.log(n)})},nextPage:function(){if(this.myQcollections.length>0){this.loadMore=!1;var n=this.myQcollections[this.myQcollections.length-1]._id;console.log(n);var e="/api/manage-qcollection/mine?page="+n;this.$http.get(e).then(function(n){if(n.data.length>0){for(var e=0;e<n.data.length;e++)this.myQcollections.push(n.data[e]);n.data.length<12?this.loadMore=!1:this.loadMore=!0}else this.loadMore=!1},function(n){this.loadMore=!0,console.log(n)})}}},watch:{show:function(n,e){n===!0&&e===!1&&this.getMyQcollectionLists()}}}},29:function(n,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]={}},35:function(n,e,o){e=n.exports=o(2)(),e.push([n.id,"@media screen and (max-width:1024px){#select-qcollection{box-sizing:border-box}}@media screen and (min-width:1025px){#select-qcollection{box-sizing:border-box;padding-left:240px}}.modal-mask{position:fixed;z-index:9998;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.5)}#select-qcollection .modal-container{width:300px;margin:130px auto 0;padding:0;background-color:#fff;border-radius:2px;box-shadow:0 2px 8px rgba(0,0,0,.33)}.modal-header{padding:20px 0 0 20px;-webkit-box-align:center;-ms-flex-align:center;-ms-grid-row-align:center;align-items:center}.modal-header h4{margin:0;color:#2196f3}.modal-body{margin:20px 0;margin-bottom:0;max-height:360px;overflow:scroll}.modal-body::-webkit-scrollbar{-webkit-appearance:none;width:6px}.modal-body::-webkit-scrollbar-thumb{border-radius:0;background-color:#ccc;-webkit-box-shadow:0 0 1px hsla(0,0%,100%,.5)}.modal-footer{padding-right:20px;padding-bottom:10px}.list{padding:0;list-style:none;margin:0}.list li{-webkit-box-align:center;-ms-flex-align:center;-ms-grid-row-align:center;align-items:center;padding:15px 20px;font-size:16px;cursor:pointer;background-image:-webkit-linear-gradient(top,#9e9e9e,#9e9e9e 51%,transparent 0);background-image:linear-gradient(180deg,#9e9e9e 0,#9e9e9e 51%,transparent 0);background-size:100% 1px;background-repeat:no-repeat}.list li:active{background-color:#eee}.list .subject-label{color:#e91e63;border:1px solid #e91e63;padding:2px 4px;font-size:13px;margin-right:8px}","",{version:3,sources:["/./src/components/reuseable/Select-qcollection.vue"],names:[],mappings:"AAEA,qCACE,oBACE,qBAAuB,CACxB,CACF,AAED,qCACE,oBACE,sBAAuB,AACvB,kBAAmB,CACpB,CACF,AAED,YACE,eAAgB,AAChB,aAAc,AACd,MAAO,AACP,OAAQ,AACR,WAAY,AACZ,YAAa,AACb,+BAAoC,CACrC,AAED,qCACE,YAAa,AACb,oBAAqB,AACrB,UAAW,AACX,sBAAuB,AACvB,kBAAmB,AACnB,oCAAyC,CAC1C,AAED,cACE,sBAAyB,AACzB,yBAA0B,AACtB,sBAAuB,AACf,0BAA2B,AAC/B,kBAAmB,CAC5B,AAED,iBACE,SAAU,AACV,aAAe,CAChB,AAED,YACE,cAAe,AACf,gBAAiB,AACjB,iBAAkB,AAClB,eAAiB,CAClB,AAED,+BACE,wBAAyB,AACzB,SAAW,CACZ,AACD,qCACE,gBAAmB,AACnB,sBAAuB,AACvB,6CAAiD,CAClD,AAED,cACE,mBAAoB,AACpB,mBAAoB,CACrB,AAED,MACE,UAAa,AACb,gBAAiB,AACjB,QAAQ,CACT,AACD,SACE,yBAA0B,AACtB,sBAAuB,AACf,0BAA2B,AAC/B,mBAAoB,AAC5B,kBAAmB,AACnB,eAAgB,AAChB,eAAgB,AAChB,gFAAyF,AACzF,6EAAuF,AACvF,yBAA0B,AAC1B,2BAA6B,CAC9B,AAED,gBACE,qBAAsB,CACvB,AAED,qBACE,cAAe,AACf,yBAA0B,AAC1B,gBAAiB,AACjB,eAAgB,AAChB,gBAAiB,CAClB",file:"Select-qcollection.vue",sourcesContent:["\n\n@media screen and (max-width: 1024px) {\n  #select-qcollection {\n    box-sizing: border-box;\n  }\n}\n\n@media screen and (min-width: 1025px) {\n  #select-qcollection {\n    box-sizing: border-box;\n    padding-left: 240px\n  }\n}\n\n.modal-mask {\n  position: fixed;\n  z-index: 9998;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(0, 0, 0, .5);\n}\n\n#select-qcollection .modal-container {\n  width: 300px;\n  margin: 130px auto 0;\n  padding: 0;\n  background-color: #fff;\n  border-radius: 2px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);\n}\n\n.modal-header {\n  padding: 20px 0px 0 20px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n              -ms-grid-row-align: center;\n          align-items: center\n}\n\n.modal-header h4 {\n  margin: 0;\n  color: #2196F3;\n}\n\n.modal-body {\n  margin: 20px 0;\n  margin-bottom: 0;\n  max-height: 360px;\n  overflow: scroll;\n}\n\n.modal-body::-webkit-scrollbar {\n  -webkit-appearance: none;\n  width: 6px;\n}\n.modal-body::-webkit-scrollbar-thumb {\n  border-radius: 0px;\n  background-color: #ccc;\n  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);\n}\n\n.modal-footer{\n  padding-right: 20px;\n  padding-bottom: 10px\n}\n\n.list {\n  padding: 0px;\n  list-style: none;\n  margin:0\n}\n.list li {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n              -ms-grid-row-align: center;\n          align-items: center;\n  padding: 15px 20px;\n  font-size: 16px;\n  cursor: pointer;\n  background-image: -webkit-linear-gradient(top, #9E9E9E 0%, #9E9E9E 51%, transparent 51%);\n  background-image: linear-gradient(to bottom, #9E9E9E 0%, #9E9E9E 51%, transparent 51%);\n  background-size: 100% 1px;\n  background-repeat: no-repeat;\n}\n\n.list li:active {\n  background-color: #eee\n}\n\n.list .subject-label {\n  color: #E91E63;\n  border: 1px solid #E91E63;\n  padding: 2px 4px;\n  font-size: 13px;\n  margin-right: 8px\n}\n\n"],sourceRoot:"webpack://"}])},36:function(n,e,o){e=n.exports=o(2)(),e.push([n.id,"@media screen and (max-width:1024px){#topbar{background-color:#fff;box-shadow:0 1px 6px rgba(0,0,0,.35);position:fixed;top:56px;left:0;right:0;z-index:99}}@media screen and (min-width:1025px){#topbar{background-color:#fff;box-shadow:0 1px 6px rgba(0,0,0,.35);position:fixed;top:64px;left:240px;right:0;z-index:99}}","",{version:3,sources:["/./src/components/reuseable/Topbar.vue"],names:[],mappings:"AACA,qCACE,QACE,sBAAuB,AACvB,qCAAuC,AACvC,eAAgB,AAChB,SAAU,AACV,OAAQ,AACR,QAAS,AACT,UAAW,CACZ,CACF,AACD,qCACE,QACE,sBAAuB,AACvB,qCAAuC,AACvC,eAAgB,AAChB,SAAU,AACV,WAAY,AACZ,QAAS,AACT,UAAW,CACZ,CACF",file:"Topbar.vue",sourcesContent:["\n@media screen and (max-width: 1024px) {\n  #topbar {\n    background-color: #fff;\n    box-shadow: 0 1px 6px rgba(0,0,0,0.35);\n    position: fixed;\n    top: 56px;\n    left: 0;\n    right: 0;\n    z-index: 99\n  }\n}\n@media screen and (min-width: 1025px) {\n  #topbar {\n    background-color: #fff;\n    box-shadow: 0 1px 6px rgba(0,0,0,0.35);\n    position: fixed;\n    top: 64px;\n    left: 240px;\n    right: 0;\n    z-index: 99\n  }\n}\n"],sourceRoot:"webpack://"}])},40:function(n,e,o){var t=o(35);"string"==typeof t&&(t=[[n.id,t,""]]);o(3)(t,{});t.locals&&(n.exports=t.locals)},41:function(n,e,o){var t=o(36);"string"==typeof t&&(t=[[n.id,t,""]]);o(3)(t,{});t.locals&&(n.exports=t.locals)},47:function(n,e){n.exports=' <div id=select-qcollection class=modal-mask v-show=show transition=modal> <div class=modal-container> <div class="modal-header flex-row"> <h4>加入題集</h4> <span class=flex style="flex: 1"></span> <mdl-button class=close @click=closeModal()> <i class=material-icons>close</i> </mdl-button> </div> <p style="text-align:center;margin:16px 0"> <mdl-spinner :active=spinnerActive v-show=spinnerActive></mdl-spinner> </p> <div class=modal-body> <ul class=list> <li class=flex-row v-for="qc in myQcollections" track-by=_id @click=saveOneToCollection(qc._id)> <span class=subject-label>{{qc.subject | subject}}</span> <span>{{qc.name}}</span> </li> </ul> <div class="flex-column flex-center" style="margin:16px 0"> <mdl-button raised primary @click=nextPage() :disabled=!loadMore>加載更多</mdl-button> </div> </div> </div> </div> '},48:function(n,e){n.exports=" <div id=topbar> <slot></slot> </div> "},49:function(n,e,o){var t,i;o(40),t=o(28),i=o(47),n.exports=t||{},n.exports.__esModule&&(n.exports=n.exports["default"]),i&&(("function"==typeof n.exports?n.exports.options||(n.exports.options={}):n.exports).template=i)},50:function(n,e,o){var t,i;o(41),t=o(29),i=o(48),n.exports=t||{},n.exports.__esModule&&(n.exports=n.exports["default"]),i&&(("function"==typeof n.exports?n.exports.options||(n.exports.options={}):n.exports).template=i)},352:function(n,e,o){"use strict";function t(n){return n&&n.__esModule?n:{"default":n}}Object.defineProperty(e,"__esModule",{value:!0});var i=o(49),s=t(i),a=o(50),l=t(a);e["default"]={ready:function(){this.getQuestions()},components:{qcollectionSelectorModal:s["default"],topbar:l["default"]},methods:{getQuestions:function(){var n=-1;this.filter.time===!0&&(n=1),this.$http.get("/api/manage-question/questions?option=all&sort="+n).then(function(n){n.data.length>0?(this.questions=n.data,this.renderQuestions(),n.data.length<9?this.loadMore=!1:this.loadMore=!0):this.loadMore=!1},function(n){this.loadMore=!1,console.log(n)})},renderQuestions:function(){setTimeout(function(){window.renderMathInElement(document.getElementById("questions-preview-container"),{delimiters:[{left:"$$",right:"$$",display:!1}]})},0)},showCollectionModal:function(n){this.$broadcast("getMyQcollectionLists"),this.CollectionModal.show=!0,this.CollectionModal.qid=n},nextPage:function(){if(this.questions.length>0){this.loadMore=!1;var n=-1;this.filter.time===!0&&(n=1);var e=this.questions[this.questions.length-1]._id,o="/api/manage-question/questions?option=all&page="+e+"&sort="+n;this.$http.get(o).then(function(n){if(n.data.length>0){console.log(n.data);for(var e=0;e<n.data.length;e++)this.questions.push(n.data[e]);this.renderQuestions(),n.data.length<9?this.loadMore=!1:this.loadMore=!0}else this.loadMore=!1},function(n){this.loadMore=!0,console.log(n)})}},getNumberArray:function(n){return new Array(n)}},data:function(){return{CollectionModal:{show:!1,qid:""},questions:[],loadMore:!0,filter:{time:!1,difficulty:null}}},watch:{filter:{handler:function(){this.getQuestions()},deep:!0}}}},400:function(n,e,o){e=n.exports=o(2)(),e.push([n.id,".filter[_v-5b7dc578]{background:#fff;padding:16px;margin:0 16px;border-radius:3px;box-shadow:0 1px 4px 0 rgba(0,0,0,.14)}","",{version:3,sources:["/./src/views/questions/All-question.vue"],names:[],mappings:"AA2IA,qBACE,gBAAiB,AACjB,aAAc,AACd,cAAsB,AACtB,kBAAmB,AACnB,sCAAyC,CAC1C",file:"All-question.vue",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.filter[_v-5b7dc578] {\n  background: #fff;\n  padding: 16px;\n  margin: 0 16px 0 16px;\n  border-radius: 3px;\n  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);\n}\n"],sourceRoot:"webpack://"}])},430:function(n,e,o){var t=o(400);"string"==typeof t&&(t=[[n.id,t,""]]);o(3)(t,{});t.locals&&(n.exports=t.locals)},504:function(n,e){n.exports=' <div id=all-question _v-5b7dc578=""> <qcollection-selector-modal :show.sync=CollectionModal.show :qid=CollectionModal.qid _v-5b7dc578=""></qcollection-selector-modal> <div class=filter _v-5b7dc578=""> <mdl-switch :checked.sync=filter.time _v-5b7dc578="">時間倒序</mdl-switch> </div> <div class=mdl-grid id=questions-preview-container _v-5b7dc578=""> <div class="mdl-cell mdl-cell--4-col question-card" v-for="q in questions" track-by=_id _v-5b7dc578=""> <div class=question-wrapper v-link="{ name: \'question-detail\', params: { question_id: q._id }}" _v-5b7dc578=""> <span class=q-subject _v-5b7dc578="">{{q.subject | subject}}</span> <span class=q-type _v-5b7dc578="">{{q.type}}</span> <div class=q-difficulty _v-5b7dc578=""> <i class=material-icons v-for="i in getNumberArray(q.difficulty)" track-by=$index _v-5b7dc578="">star_rate</i> </div> <p class=q-context v-html=q.context _v-5b7dc578=""></p> <span class=q-tag v-for="tag in q.tags" _v-5b7dc578="">{{tag}}</span> </div> <div class=question-tools _v-5b7dc578=""> <mdl-button v-on:click=showCollectionModal(q._id) _v-5b7dc578=""><i class=material-icons _v-5b7dc578="">add</i>加入題集</mdl-button> </div> </div> </div> <div class="flex-column flex-center" style="margin:16px 0 32px 0" _v-5b7dc578=""> <mdl-button raised="" primary="" @click=nextPage() :disabled=!loadMore _v-5b7dc578="">加載更多</mdl-button> </div> </div> '},523:function(n,e,o){var t,i;o(430),t=o(352),i=o(504),n.exports=t||{},n.exports.__esModule&&(n.exports=n.exports["default"]),i&&(("function"==typeof n.exports?n.exports.options||(n.exports.options={}):n.exports).template=i)}});
//# sourceMappingURL=8.bc6aea32f33194265d6b.js.map