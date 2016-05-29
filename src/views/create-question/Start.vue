<style>
#start-create-question .main-wrapper {
  background: #fff;
  margin-top: 16px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.14)
}

#start-create-question .nav-card {
  padding: 32px;
  font-size: 20px;
  color: #616161;
}

#start-create-question .nav-card:hover {
  background: #f7f7f7;
  cursor: pointer;
}

#start-create-question .nav-card:active {
  background: #f2f2f2;
  cursor: pointer;
}
</style>
<template>
  <div id="start-create-question">

    <div class="main-wrapper">
      <div class="flex-column">
        <div class="flex-row" style="border-bottom:1px solid #eee">
          <div class="flex-column flex-50 flex-center nav-card" v-link="{name:'create-mc-question'}" style="border-right:1px solid #eee">
            <span>單項選擇</span>
          </div>
          <div class="flex-column flex-50 flex-center nav-card" v-link="{name:'create-mc-question-set'}">
            <span>單項選擇-題集</span>
          </div>
        </div>
        <div class="flex-row">
          <div class="flex-column flex-50 flex-center nav-card">
            <span>閱讀題</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
