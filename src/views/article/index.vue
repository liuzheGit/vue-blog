<template>
  <div class="container">
    <template v-if="article">
      <h2>标题: {{article.get('title')}}</h2>
      <div class="operator" v-if="uid === article.get('author').get('objectId')">
        <router-link :to="{ name:'ArticleEdit',params: {id: article.id} }" class="el-button el-button--info" tag="button" round>修改</router-link>
        <el-button @click="articleDestroy">删除</el-button>
      </div>
      <div class="content" v-html="article.get('content')"></div>
    </template>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "index",
    data(){
      return {
        article: null
      }
    },
    created(){
      const id = this.$route.params.id;
      this.getArticle(id)
    },
    computed:{
      ...mapGetters(['uid'])
    },
    methods: {
      getArticle: function (id) {
        const q = new this.$api.SDK.Query('Article');
        q.include('author');
        q.include('category');
        q.get(id).then((article) => {
          this.article = article;
          this.$Progress.finish();
        }).catch(err=>console.log(err))
      },
      articleDestroy(){
        this.article.destroy().then(()=>{
          this.$message({type: 'success', message: '删除成功'});
          this.$router.replace({path: '/article?type=all'})
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>