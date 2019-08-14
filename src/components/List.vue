<template>
  <div class="container">
    <el-container>
      <el-header> <h1>{{title}}</h1> </el-header>
      <el-main>
        <article v-for="article in articles">
          <h3>
            <router-link :to="{name: 'ArticleShow', params: {id: article.id}}">
              {{article.get('title')}}
            </router-link>
            |
            <router-link :to="{name: 'User', params: {id: article.get('author').id}}">{{article.get('author').get('username')}}</router-link>
          </h3>
        </article>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'List',
    data(){
      return {
        title: '',
        articles: []
      }
    },
    created(){
      this.match();
    },
    watch: {
      ['$route.query'](){
        console.log('list 路由改变重新渲染列表');
        this.articles = [];
        this.match()
      }
    },
    computed: mapState(['user']),
    methods: {
      match(){
        let flag = this.$route.query.type || this.$route.query.cid;
        this.$Progress.start();
        switch (flag) {
          case 'me':
            this.getMyArticles();
            break;
          case 'all':
            this.getAllArticles();
            break;
          default:
            this.getCategoryArticle(flag)
        }
      },
      query(){
        let q = new this.$api.SDK.Query('Article');
        q.include('category');
        q.include('author');
        q.include('cratedAt');
        return q;
      },
      setArticles(q){
        q.find().then((articles)=>{
          this.articles = articles;
          this.$Progress.finish();
        }).catch(err=>{
          console.log(err);
          this.fail();
        })
      },
      fail(error){
        this.$message.error(error);
        this.$Progress.fail();
      },
      getAllArticles(){
        this.title = '所有文章';
        const q = this.query();
        this.setArticles(q)
      },
      getMyArticles(){
        this.title = '我的文章';
        const q = this.query();
        this.setArticles(q)
      },
      getCagegoryObj(id){
        return this.$api.SDK.Object.createWidthoutData('Category', id)
      },
      getCategoryArticle(cid) {
        let cateObj = this.getCagegoryObj(cid)
        const q = this.query();
        q.equalTo('category', cateObj)
        this.setArticles(q)
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>