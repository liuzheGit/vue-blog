<template>
  <div class="container">

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
    },
    methods: {
      getCurrentUser(){
        const id = this.id;
        let q = new this.$api.SDK.Query('_User');
        q.get(id).then((user)=>{
          this.current_user = user;
          return user;
        }).then((user)=>{

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
      }
    }
  }
</script>

<style scoped lang="scss">

</style>