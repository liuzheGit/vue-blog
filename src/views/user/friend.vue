<template>
    <div class="container">
    <el-header class="page-header">
      我的朋友圈
    </el-header>
    <ul v-if="statuses.length">
      <li v-for="status in statuses">
        <router-link :to="{name:'User', params: { id: status.get('source').id  }}">{{ status.get('source').get('username') }}</router-link> 在 {{ status.createdAt }}
        <span v-if="status.get('type') == 'create_article' ">
          创建了新的文章 <router-link :to="{ name: 'ArticleShow', params:{ id: status.get('article').id } }">{{ status.get('article').get('title') }}</router-link>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "friend",
    data(){
      return {
        statuses: {}
      }
    },
    created(){
      this.getFriendMsg()
    },
    methods: {
      getFriendMsg(){
        const followeesQ = this.$store.state.user.followeeQuery();
        followeesQ.find().then(followees =>{
          console.log('获取关注的人')
          console.log(followees)
          const query = new this.$api.SDK.Query('_status');
          query.include('source');
          query.include('article');
          query.equalTo('inboxType', 'friend');
          query.containedIn('source', followees);
          return query.find();
        }).then((statuses) =>{
          this.statuses = statuses
          this.$Progress.finish();
        },err=>console.log(err))
      }
    }
  }
</script>

<style scoped lang="scss">

</style>