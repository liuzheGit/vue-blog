<template>
  <div class="container">
    {{uid}}
    <template v-if="article">
      <h2>{{article.get('title')}}</h2>
      <!--<div class="operator" v-if="uid === article.get('author').id">-->
        <div class="operator">
        <el-button>修改</el-button>
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
          console.log('文章-----')
          console.log(article)
          console.log(article.get('author'))
          this.article = article;
          this.$Progress.finish();
        }).catch(err=>console.log(err))
      },
      articleDestroy(){
        this.article.destory().then(()=>{
          this.$message({type: 'success', message: '删除成功'});
          this.$router.replace({path: '/article?type=all'})
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>