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
    create(){
      this.match();
    },
    watch: {
      ['$route.query'](){
        console.log('render');
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
            this.getCategories(flag)
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
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>