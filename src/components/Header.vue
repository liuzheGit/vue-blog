<template>
  <div class="container">
    <el-menu
      :default-active="active"
      class="el-menu-header"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/"><i class="el-icon-s-home"></i><span>主页</span></el-menu-item>
      <el-menu-item index="/article?type=all"><i class="el-icon-tickets"></i><span>分类</span></el-menu-item>

      <template v-if="user">
        <el-menu-item class="right" @click="handleExit"><span>注销</span></el-menu-item>
        <el-submenu index="5" class="right">
          <template slot="title"><i class="el-icon-monitor"></i><span>{{user.getUsername()}}</span></template>
          <el-menu-item>
            <router-link :to="{name: 'User', params: {id: user.id}}">我的主页</router-link>
          </el-menu-item>
          <el-menu-item index="/article?type=me">我的文章</el-menu-item>
          <el-menu-item index="/article/create">发布文章</el-menu-item>
          <el-menu-item index="5-1">消息</el-menu-item>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item class="right" index="/signUp"><span>注册</span></el-menu-item>
        <el-menu-item class="right" index="/signIn"><span>登录</span></el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'i-header',
    data() {
      return {
        active: '/'
      }
    },
    computed: mapState(['user']),
    created(){
      this.active = this.$route.path; // 解决刷新不高亮
      this.$router.afterEach((to, from)=>{
        // console.log('afterEach-----to')
        // console.log(to.path)
        this.active = to.path;  // 解决编程式切换路由不高亮
      })
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log('路由的key')
        console.log(key);
        this.$router.push(key)
      },
      ...mapActions(['exit']),
      handleExit(){
        this.exit();
        this.$api.SDK.User.logOut();  // SDK的退出
        this.$message.success('成功退出')
      }
    },
    mounted(){
      // console.log(this.user.getUsername())
    }
  }
</script>

<style lang="scss" scoped>
  .el-menu--horizontal > .el-menu-item.right, .el-submenu.right {
    float: right;
  }

  a{ color: #fff; text-decoration: none; }
  a:visited{ color: #fff; }
</style>