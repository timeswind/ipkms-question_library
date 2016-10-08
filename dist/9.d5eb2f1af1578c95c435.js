webpackJsonp([9],{9:function(n,t){"use strict";t=n.exports=function(n){n=JSON.parse(n);var t=n.map(function(n){var t=n.insert;if("string"!=typeof n.insert){if(!n.insert.formula)return"";t=window.katex.renderToString(n.insert.formula)}return n.attributes&&n.attributes.bold&&(t="<strong>"+t+"</strong>"),n.insert.formula&&(t=window.katex.renderToString(n.insert.formula)),t}).join("");return t}},14:function(n,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={props:{}}},17:function(n,t,e){t=n.exports=e(2)(),t.push([n.id,".card{background:#fff;border:1px solid rgba(0,0,0,.1);box-shadow:0 1px 4px rgba(0,0,0,.05)}","",{version:3,sources:["/./src/components/reuseable/Card.vue"],names:[],mappings:"AACA,MACE,gBAAiB,AACjB,gCAAkC,AAClC,oCAAuC,CACxC",file:"Card.vue",sourcesContent:["\n.card {\n  background: #fff;\n  border: 1px solid rgba(0,0,0,0.1);\n  box-shadow: 0 1px 4px rgba(0,0,0,0.05);\n}\n"],sourceRoot:"webpack://"}])},18:function(n,t,e){var i=e(17);"string"==typeof i&&(i=[[n.id,i,""]]);e(3)(i,{});i.locals&&(n.exports=i.locals)},20:function(n,t){n.exports=" <div> <div class=card> <slot name=content></slot> </div> </div> "},21:function(n,t,e){var i,s,a={};e(18),i=e(14),s=e(20),n.exports=i||{},n.exports.__esModule&&(n.exports=n.exports["default"]);var d="function"==typeof n.exports?n.exports.options||(n.exports.options={}):n.exports;s&&(d.template=s),d.computed||(d.computed={}),Object.keys(a).forEach(function(n){var t=a[n];d.computed[n]=function(){return t}})},30:function(n,t,e){n.exports={"default":e(31),__esModule:!0}},31:function(n,t,e){var i=e(11),s=i.JSON||(i.JSON={stringify:JSON.stringify});n.exports=function(n){return s.stringify.apply(s,arguments)}},360:function(n,t,e){"use strict";function i(n){return n&&n.__esModule?n:{"default":n}}Object.defineProperty(t,"__esModule",{value:!0});var s=e(30),a=i(s),d=e(21),c=i(d),l=e(22),o=i(l),r=e(9),p=i(r);t["default"]={ready:function(){this.$route.params.question_id?(this.validateURL=!0,this.getQuestionDetail(this.$route.params.question_id)):this.answer.buttonDisable=!0},components:{Card:c["default"]},methods:{renderDelta:function(n){return(0,p["default"])(n)},getQuestionDetail:function(n){var t="/api/manage-question/question/"+n;this.$http.get(t).then(function(n){this.details=n.data,"mc"===n.data.type&&(this.answer.mc=n.data.answer.mc),console.log(n.data.delta),n.data.delta&&""!==n.data.delta||(console.log("old render"),this.renderQuestions()),this.tempDetails=JSON.parse((0,a["default"])(n.data)),this.details.createdBy&&"self"===this.details.createdBy&&(this.edit.on=!0)},function(n){console.log(n)})},renderQuestions:function(){setTimeout(function(){window.renderMathInElement(document.getElementById("question-body"),{delimiters:[{left:"$$",right:"$$",display:!1}]})},0)},modify:function(n,t,e){if("self"===this.details.createdBy)if("difficulty"===n){var i=e+1;this.details.difficulty!==i&&(this.details.difficulty=e+1,this.edit.change=!0)}else if("tag"===n)"add"===t&&e?""!==e.trim()&&(this.details.tags.indexOf(e)===-1?(this.edit.change=!0,this.details.tags.push(e),this.edit.tag=""):this.edit.tag=""):"remove"===t&&e>=0&&(this.edit.change=!0,this.details.tags.splice(e,1));else if("rightAnswer"===n){var s=t;if("mc"===s){var a=e;this.details.answer.mc!==a&&(this.details.answer.mc=a,this.answer.mc=a,this.edit.change=!0)}}},updateInfo:function(){if(this.details.subject!==this.tempDetails.subject||this.details.difficulty!==this.tempDetails.difficulty||(0,a["default"])(this.details.tags)!==(0,a["default"])(this.tempDetails.tags)||this.details.answer!==this.tempDetails.answer){var n={subject:this.details.subject,difficulty:this.details.difficulty,tags:this.details.tags,answer:this.details.answer},t="/api/manage-question/question/"+this.$route.params.question_id;this.$http.put(t,n).then(function(n){this.$showToast("修改成功"),this.edit.change=!1,this.details.updated_at=new Date,this.tempDetails=JSON.parse((0,a["default"])(this.details))},function(n){console.log(n)})}},cancelUpdate:function(){this.sheetshow=!1,this.details=JSON.parse((0,a["default"])(this.tempDetails)),"mc"===this.details.type&&(this.answer.mc=this.details.answer.mc),this.edit.change=!1},getNumberArray:function(n){return new Array(n)}},data:function(){return{validateURL:!1,choice:Number,details:{},tempDetails:{},answer:{mc:null},subjects:o["default"].subjects,edit:{on:!1,change:!1,tag:""}}}}},401:function(n,t,e){t=n.exports=e(2)(),t.push([n.id,".q-d-subject{float:left;padding:4px 8px;color:#fff;background:#03a9f4;margin-right:5px}.q-d-context{margin:0;font-size:20px;font-weight:700;padding-left:12px;border-left:4px solid #3f51b5;margin-top:20px}.q-d-public{color:#e91e63;float:right;padding:8px}.q-d-difficulty{float:none}.q-d-difficulty i{width:24px;color:#ffc107}.q-d-tag{color:#e91e63;margin:0 8px 0 0;padding:2px 4px;border:1px solid #e91e63;cursor:pointer}#question-detail #question-body{max-width:800px;margin:0 auto;margin-top:8px}#question-detail #question-body p{margin:0}.q-d-info-wrapper{margin-bottom:10px}.q-d-mc-wrapper .card{padding:16px}.q-d-mc-wrapper .hightlight-answer .card{background-color:#009688;color:#fff}.q-d-mc-wrapper .wrong .card{background-color:#f44336;color:#fff}.q-d-mc-wrapper .mc-choice-label{font-size:20px;color:#607d8b;float:left;line-height:25px;padding-right:10px}.q-d-mc-wrapper .hightlight-answer .mc-choice-label,.q-d-mc-wrapper .wrong .mc-choice-label{color:#fff}.difficulty-box{padding:10px 0}.difficulty-box i{width:24px;color:#aaa;cursor:pointer}.difficulty-heighlight{color:#ffc107!important}","",{version:3,sources:["/./src/views/questions/Question-detail.vue"],names:[],mappings:"AA4OA,aACE,WAAY,AACZ,gBAAiB,AACjB,WAAY,AACZ,mBAAoB,AACpB,gBAAiB,CAClB,AACD,aACE,SAAU,AACV,eAAgB,AAChB,gBAAkB,AAClB,kBAAmB,AACnB,8BAA+B,AAC/B,eAAgB,CACjB,AACD,YACE,cAAe,AACf,YAAa,AACb,WAAa,CACd,AACD,gBACE,UAAY,CACb,AACD,kBACE,WAAY,AACZ,aAAc,CACf,AACD,SACE,cAAe,AACf,iBAAkB,AAClB,gBAAiB,AACjB,yBAA0B,AAC1B,cAAgB,CACjB,AAED,gCACE,gBAAiB,AACjB,cAAe,AACf,cAAe,CAChB,AAED,kCACE,QAAS,CACV,AAED,kBACE,kBAAmB,CACpB,AACD,sBACE,YAAa,CACd,AAED,yCACE,yBAA0B,AAC1B,UAAW,CACZ,AAED,6BACE,yBAA0B,AAC1B,UAAW,CACZ,AAED,iCACE,eAAgB,AAChB,cAAe,AACf,WAAY,AACZ,iBAAkB,AAClB,kBAAoB,CACrB,AAMD,4FACE,UAAW,CACZ,AAED,gBACE,cAAe,CAChB,AACD,kBACE,WAAY,AACZ,WAAY,AACZ,cAAgB,CACjB,AAED,uBACE,uBAAyB,CAC1B",file:"Question-detail.vue",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.q-d-subject {\n  float: left;\n  padding: 4px 8px;\n  color: #fff;\n  background: #03A9F4;\n  margin-right: 5px\n}\n.q-d-context {\n  margin: 0;\n  font-size: 20px;\n  font-weight: bold;\n  padding-left: 12px;\n  border-left: 4px solid #3F51B5;\n  margin-top: 20px\n}\n.q-d-public {\n  color: #E91E63;\n  float: right;\n  padding: 8px;\n}\n.q-d-difficulty {\n  float: none;\n}\n.q-d-difficulty i {\n  width: 24px;\n  color: #FFC107\n}\n.q-d-tag {\n  color: #E91E63;\n  margin: 0 8px 0 0;\n  padding: 2px 4px;\n  border: 1px solid #e91e63;\n  cursor: pointer;\n}\n\n#question-detail #question-body {\n  max-width: 800px;\n  margin: 0 auto;\n  margin-top: 8px\n}\n\n#question-detail #question-body p {\n  margin: 0\n}\n\n.q-d-info-wrapper {\n  margin-bottom: 10px\n}\n.q-d-mc-wrapper .card {\n  padding: 16px\n}\n\n.q-d-mc-wrapper .hightlight-answer .card {\n  background-color: #009688;\n  color: #fff\n}\n\n.q-d-mc-wrapper .wrong .card {\n  background-color: #F44336;\n  color: #fff\n}\n\n.q-d-mc-wrapper .mc-choice-label {\n  font-size: 20px;\n  color: #607D8B;\n  float: left;\n  line-height: 25px;\n  padding-right: 10px;\n}\n\n.q-d-mc-wrapper .hightlight-answer .mc-choice-label {\n  color: #fff\n}\n\n.q-d-mc-wrapper .wrong .mc-choice-label {\n  color: #fff\n}\n\n.difficulty-box {\n  padding: 10px 0\n}\n.difficulty-box i {\n  width: 24px;\n  color: #aaa;\n  cursor: pointer;\n}\n\n.difficulty-heighlight{\n  color: #FFC107 !important\n}\n\n"],sourceRoot:"webpack://"}])},432:function(n,t,e){var i=e(401);"string"==typeof i&&(i=[[n.id,i,""]]);e(3)(i,{});i.locals&&(n.exports=i.locals)},507:function(n,t){n.exports=' <div id=question-detail> <div id=question-body> <p style="margin: 8px 0;color: #9E9E9E; text-align:center">最後更新于 {{ details.updated_at | calendar}}</p> <card> <div slot=content> <div class=flex-column> <div class="flex-row flex-center" style="padding: 16px 16px 0 16px"> <div class="flex-column flex-50"> <span class=field-title>科目 Subject</span> <select v-model=details.subject> <option v-for="subject in subjects" v-bind:value=subject.id> {{ subject.name }} </option> </select> </div> <div class="difficulty-box flex-column flex-50"> <span class=field-title>難度 Difficulty</span> <span class="flex-row flex-baseline" style="margin-top: 8px"> <i class=material-icons v-for="n in 5" @click="modify(\'difficulty\', null, $index)" :class="{\'difficulty-heighlight\': details.difficulty > $index}">star_rate</i> </span> </div> </div> <div class=flex-column style="padding: 16px 16px 16px 16px"> <span class=field-title>標籤 Tags</span> <div class="flex-row flex-center flex-wrap" style=margin-top:8px> <span class=q-d-tag @click="modify(\'tag\', \'remove\', $index)" v-for="tag in details.tags" track-by=$index>{{tag}}</span> <mdl-textfield label=輸入標籤.回車 @keyup.enter="modify(\'tag\', \'add\', edit.tag)" :value.sync=edit.tag style=width:200px></mdl-textfield> </div> </div> </div> </div> </card> <div class=flex-row style="padding: 16px 0; justify-content: flex-end" v-if=edit.on> <mdl-button @click=cancelUpdate() v-show=edit.change> 取消 </mdl-button> <mdl-button primary accent raised @click=updateInfo() :disabled=!edit.change> 修改 </mdl-button> </div> <div v-if="details.type === \'mc\'"> <card> <div slot=content style=padding:16px> <div class=q-d-info-wrapper> <span class=q-d-subject>{{details.subject | subject}}</span> <div class=q-d-difficulty> <i class=material-icons v-for="i in getNumberArray(details.difficulty)" track-by=$index>star_rate</i> </div> </div> <div v-if=details.delta> <div v-html=renderDelta(details.delta)></div> </div> <div v-if=details.context> <div v-html=details.context></div> </div> </div> </card> <div v-if="details.type === \'mc\'" class="q-d-mc-wrapper flex-column"> <div v-if=details.delta> <div class=flex-row> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 0}" @click="modify(\'rightAnswer\', \'mc\', 0)"><div slot=content><span class=mc-choice-label>A</span><div v-html=renderDelta(details.choices[0])></div></div></card> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 1}" @click="modify(\'rightAnswer\', \'mc\', 1)"><div slot=content><span class=mc-choice-label>B</span><div v-html=renderDelta(details.choices[1])></div></div></card> </div> <div class=flex-row> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 2}" @click="modify(\'rightAnswer\', \'mc\', 2)"><div slot=content><span class=mc-choice-label>C</span><div v-html=renderDelta(details.choices[2])></div></div></card> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 3}" @click="modify(\'rightAnswer\', \'mc\', 3)"><div slot=content><span class=mc-choice-label>D</span><div v-html=renderDelta(details.choices[3])></div></div></card> </div> </div> <div v-if=details.context> <div class=flex-row> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 0}" @click="modify(\'rightAnswer\', \'mc\', 0)"><div slot=content><span class=mc-choice-label>A</span><div v-html=details.choices[0]></div></div></card> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 1}" @click="modify(\'rightAnswer\', \'mc\', 1)"><div slot=content><span class=mc-choice-label>B</span><div v-html=details.choices[1]></div></div></card> </div> <div class=flex-row> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 2}" @click="modify(\'rightAnswer\', \'mc\', 2)"><div slot=content><span class=mc-choice-label>C</span><div v-html=details.choices[2]></div></div></card> <card class=flex-50 :class="{\'hightlight-answer\': answer.mc === 3}" @click="modify(\'rightAnswer\', \'mc\', 3)"><div slot=content><span class=mc-choice-label>D</span><div v-html=details.choices[3]></div></div></card> </div> </div> </div> <card v-if=details.statistic> <div slot=content style=padding:16px> {{details.statistic | json}} </div> </card> </div> </div> </div> '},536:function(n,t,e){var i,s,a={};e(432),i=e(360),s=e(507),n.exports=i||{},n.exports.__esModule&&(n.exports=n.exports["default"]);var d="function"==typeof n.exports?n.exports.options||(n.exports.options={}):n.exports;s&&(d.template=s),d.computed||(d.computed={}),Object.keys(a).forEach(function(n){var t=a[n];d.computed[n]=function(){return t}})}});
//# sourceMappingURL=9.d5eb2f1af1578c95c435.js.map