webpackJsonp([11],{316:function(o,t,e){"use strict";function a(o){return o&&o.__esModule?o:{default:o}}Object.defineProperty(t,"__esModule",{value:!0});var i=e(5),n=a(i),s=e(7);t.default={data:function(){return{login:{school:"pkms",email:"",password:"",warn:""}}},methods:(0,n.default)({auth:function(){var o=/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;if(o.test(this.login.email)){var t={school:this.login.school,email:this.login.email,password:this.login.password};this.$http.post("/api/login",t).then(function(o){200===o.status&&o.data&&o.data.token&&(window.sessionStorage.token=o.data.token,window.sessionStorage.role=o.data.role,this.setUserRole(o.data.role),this.login.email="",this.login.password="",this.login.warn="","admin"===o.data.role?this.$router.push({name:"admin"}):this.$router.push({name:"entry"}))},function(o){400===o.status&&(this.login.password="",this.login.warn="登入失败")})}else this.login.warn="請輸入正確的郵箱地址"}},(0,s.mapActions)({setUserRole:"setUserRole"}))}},394:function(o,t,e){t=o.exports=e(2)(),t.push([o.id,".login-modal-card[data-v-68650f35]{background:#fff;max-width:300px;margin:80px auto 0;box-shadow:0 1px 4px rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.09);padding:16px;border-radius:3px}","",{version:3,sources:["/./src/views/Login.vue"],names:[],mappings:"AACA,mCACE,gBAAiB,AACjB,gBAAiB,AACjB,mBAAyB,AACzB,qCAAsC,AACtC,iCAAkC,AAClC,aAAc,AACd,iBAAmB,CACpB",file:"Login.vue",sourcesContent:["\n.login-modal-card[data-v-68650f35] {\n  background: #fff;\n  max-width: 300px;\n  margin: 80px auto 0 auto;\n  box-shadow: 0 1px 4px rgba(0,0,0,.04);\n  border: 1px solid rgba(0,0,0,.09);\n  padding: 16px;\n  border-radius: 3px;\n}\n"],sourceRoot:"webpack://"}])},411:function(o,t,e){var a=e(394);"string"==typeof a&&(a=[[o.id,a,""]]);e(3)(a,{});a.locals&&(o.exports=a.locals)},501:function(o,t,e){var a,i;e(411),a=e(316);var n=e(523);i=a=a||{},"object"!=typeof a.default&&"function"!=typeof a.default||(i=a=a.default),"function"==typeof i&&(i=i.options),i.render=n.render,i.staticRenderFns=n.staticRenderFns,i._scopeId="data-v-68650f35",o.exports=a},523:function(o,t){o.exports={render:function(){var o=this;return o._h("div",{attrs:{id:"login"}},[o._h("div",{staticClass:"main-wrapper"},[o._h("div",{staticClass:"flex-column"},[o._h("div",{staticClass:"login-modal-card flex-column"},[o._h("h4",{staticClass:"display-1",staticStyle:{"margin-top":"0"}},["登入"])," ",o._h("mu-text-field",{directives:[{name:"model",rawName:"v-model",value:o.login.school,expression:"login.school"}],attrs:{label:"學校",hintText:"學校",type:"text"},domProps:{value:o.login.school},on:{input:function(t){o.login.school=t}}})," ",o._h("mu-text-field",{directives:[{name:"model",rawName:"v-model",value:o.login.email,expression:"login.email"}],attrs:{label:"郵箱",hintText:"郵箱",type:"email"},domProps:{value:o.login.email},on:{input:function(t){o.login.email=t}}})," ",o._h("mu-text-field",{directives:[{name:"model",rawName:"v-model",value:o.login.password,expression:"login.password"}],attrs:{label:"密碼",hintText:"密碼",type:"password"},domProps:{value:o.login.password},on:{input:function(t){o.login.password=t}}})," ",o._h("span",{staticStyle:{color:"#F44336","text-align":"center",margin:"8px"}},[o._s(o.login.warn)])," ",o._h("mu-raised-button",{attrs:{label:"登入",primary:""},on:{click:function(t){o.auth()}}})])])])])},staticRenderFns:[]}}});
//# sourceMappingURL=11.87b6b689532ee5692274.js.map