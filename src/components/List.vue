<template>
  <div class="container">
    <el-container>
      <el-header class="page-header">
        所有文章
      </el-header>
      <el-main class="list-main">
        <article v-for="article in articles" class="list-item">
          <router-link  class="item-user" :to="{name: 'User', params: {id: article.get('author').id}}">
            <div class="avatar"></div>
            {{article.get('author').get('username')}}
          </router-link>
          <router-link :to="{name: 'ArticleShow', params: {id: article.id}}">
            {{article.get('title')}}
          </router-link>
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
        articles: []
      }
    },
    created(){
      this.getAllArticles();
    },
    computed: mapState(['user']),
    methods: {
      getAllArticles(){
        const q = this.query();
        this.setArticles(q)
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
      }
    }
  }
</script>


<style lang="scss" scoped>
  .list-item{
    padding: 8px;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #333;
    &:last-child{
      border-bottom: none;
    }
    .item-user{
      padding: 4px;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .avatar{
        width: 30px;
        height: 30px;
        background: #888;
      }
    }
  }
</style>
