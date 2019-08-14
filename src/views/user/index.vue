<template>
  <div class="container" v-if="current_user">
    <h3>{{current_user.get('username')}}</h3>
    <hr>
    <div class="operator" v-if="user">
      <el-button v-if="user.id !== current_user.id" @click="toggleFollow">{{followed ? '取消关注' : '关注'}}该用户</el-button>
    </div>
    <ul>
      <li v-for="article in articles">
        <router-link :to="{name: 'ArticleShow', params: {id: article.id}}">{{article.get('title')}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: "user",
    data(){
      const id = this.$route.params.id;
      return {
        current_user: null,
        articles: null,
        followed: false,
        id
      }
    },
    computed: mapState(['user']),
    created(){
      this.getCurrentUser();
    },
    methods: {
      getCurrentUser(){
        const id = this.id;
        let q = new this.$api.SDK.Query('_User');
        q.get(id).then((user)=>{
          this.current_user = user;
          return user;
        }).then((user)=>{
          this.getArticles(user);
          this.checkFollowed();
        })
      },
      getArticles(user){
        let q = new this.$api.SDK.Query('Article');
        q.equalTo('author', user);
        q.ascending('createAt');
        q.find().then(articles => {
          this.articles = articles
          this.$Progress.finish();
        }).catch(err=>console.log(err))
      },
      toggleFollow(){
        const id = this.id;
        if(this.followed){
          this.user.unfollow(id).then(()=>{
            this.followed = false;
            this.$message.success('取消关注成功');
          }).catch(err=>console.log(err))
        }else {
          this.user.follow(id).then(()=>{
            this.followed = true;
            this.$message.success('关注成功')
          }).catch(err=>console.log(err))
        }
      },
      checkFollowed(){
        const id = this.id;
        const q = this.user.flloweeQuery();
        q.include('followee');
        q.find().then(followee =>{
          if(followee.length) {
            if(followee.some(f => f.id === id)){
              this.followed  = true;
            }
          }
          return
        }).catch(err=>console.log(err))
      }
    }
  }
//   目前 8-14:建行: -3600   浦发: -1700   招行: -4300  民生: -1600  中信: -800
//  总共有 7000 的欠款  有 中信和 浦发的 7000 去还 民生招行建行的 7000 就行了
//  两个1号的还款是和 建行的是13号 : 4300 + 1600 + 3600 =  9500

//  浦发 3000(1700)  中信 4000(800)
//  招行: 2000(4300) 民生2000(1600)  建行 3000(3600)
//  9月1  还 5900   9-13 还3600
//


</script>

<style scoped lang="scss">

</style>