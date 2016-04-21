<style>
#entry .main-wrapper {
  background: #fff;
  margin-top: 16px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.14)
}

#entry .nav-card {
  padding: 32px;
  font-size: 20px;
  color: #616161;
}

#entry .nav-card:hover {
  background: #f7f7f7;
  cursor: pointer;
}

#entry .nav-card:active {
  background: #f2f2f2;
  cursor: pointer;
}
</style>
<template>
  <div id="entry">
    <div class="main-wrapper">
      <div class="flex-column">
        <div class="flex-row" style="border-bottom:1px solid #eee">
            <div class="flex-column flex-50 flex-center nav-card" style="border-right:1px solid #eee">
              <span>創建題目</span>
            </div>
            <div class="flex-column flex-50 flex-center nav-card">
              <span>管理題目</span>
            </div>
        </div>
        <div class="flex-row">
            <div class="flex-column flex-50 flex-center nav-card" style="border-right:1px solid #eee">
              <span>管理題集</span>
            </div>
            <div class="flex-column flex-50 flex-center nav-card">
              <span>Quick Quiz</span>
            </div>
        </div>
        <div class="flex-row">
            <div class="flex-column flex-50 flex-center nav-card" style="border-top:1px solid #eee">
              <span>使用指南</span>
            </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>
