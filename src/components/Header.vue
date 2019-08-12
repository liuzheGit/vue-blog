<template>
  <div class="header">
    <el-container>
      <el-header>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/"><i class="el-icon-s-home"></i><span>主页</span></el-menu-item>
            <el-menu-item index="/list"><i class="el-icon-tickets"></i><span>分类</span></el-menu-item>

            <el-menu-item class="right" index="4"><span>注册</span></el-menu-item>
            <el-menu-item class="right" index="3"><span>登录</span></el-menu-item>
            <el-menu-item class="right" index="6"><span>注销</span></el-menu-item>

            <el-submenu index="5" class="right">
              <template slot="title"><i class="el-icon-monitor"></i><span>我的工作台</span></template>
              <el-menu-item index="5-1">个人中心</el-menu-item>
              <el-menu-item index="5-2">发布文章</el-menu-item>
              <el-menu-item index="5-3">消息</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-header>
      <el-main>el-main</el-main>
      <el-footer>el-footer</el-footer>
    </el-container>
  </div>
</template>
<script>
  export default {
    name: 'i-header',
    data(){
      return {
        activeIndex: '1'
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-menu--horizontal>.el-menu-item.right,.el-submenu.right{
    float: right;
  }
</style>