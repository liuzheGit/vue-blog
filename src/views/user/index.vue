<template>
  <div class="container" v-if="current_user">
    <el-header class="page-header">
      {{current_user.get('username')}}
    </el-header>
    <hr>
    <div class="operator" v-if="user">
      <el-button v-if="user.id !== current_user.id" @click="toggleFollow">{{followed ? '取消关注' : '关注'}}该用户</el-button>
      <el-button v-if="user.id !== current_user.id" @click="dialogFormVisible = true">发送私信</el-button>
    </div>
    <ul>
      <li v-for="article in articles">
        <router-link :to="{name: 'ArticleShow', params: {id: article.id}}">{{article.get('title')}}</router-link>
      </li>
    </ul>

    <el-dialog title="发送私信给该用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="80px" label-position="top" :rules="rules">
        <el-form-item label="私信内容" prop="msg">
          <el-input type="textarea" v-model="form.msg"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button typeof="primary" @click="sendMsg">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "user",
    data() {
      const id = this.$route.params.id;
      return {
        current_user: null,
        articles: null,
        followed: false,
        id,
        dialogFormVisible: false,
        form: {
          msg: ''
        },
        rules: {
          msg: [
            {require: true, message: '必填项', trigger: 'blur'}
          ]
        }
      }
    },
    computed: mapState(['user']),
    created() {
      this.getCurrentUser();
    },
    methods: {
      getCurrentUser() {
        const id = this.id;
        let q = new this.$api.SDK.Query('_User');
        q.get(id).then((user) => {
          this.current_user = user;
          return user;
        }).then((user) => {
          this.getArticles(user);
          this.checkFollowed();
        })
      },
      getArticles(user) {
        let q = new this.$api.SDK.Query('Article');
        q.equalTo('author', user);
        q.ascending('createAt');
        q.find().then(articles => {
          this.articles = articles
          this.$Progress.finish();
        }).catch(err => console.log(err))
      },
      toggleFollow() {
        const id = this.id;
        if (this.followed) {
          this.user.unfollow(id).then(() => {
            this.followed = false;
            this.$message.success('取消关注成功');
          }).catch(err => console.log(err))
        } else {
          this.user.follow(id).then(() => {
            this.followed = true;
            this.$message.success('关注成功')
          }).catch(err => console.log(err))
        }
      },
      checkFollowed() {
        const id = this.id;
        const q = this.user.flloweeQuery();
        q.include('followee');
        q.find().then(followee => {
          if (followee.length) {
            if (followee.some(f => f.id === id)) {
              this.followed = true;
            }
          }
          return
        }).catch(err => console.log(err))
      },
      sendMsg() {
        if (!this.form.msg) {
          this.$.error('信息不能为空');
          return
        }
        const Status = this.$api.SDK.Status;
        const status = new Status(null, this.form.msg);
        status.set('from', this.user);
        status.set('to', this.current_user);
        status.set("ACL", { "*":{ "read":true, "write":true }});
        Status.sendPrivateStatus(status, this.current_user.id).then((status) => {
          if (status) {
            this.dialogFormVisible = false;
            this.$message({message: '发送私信成功！', type: 'success'});
          }
        }, (err) => {
          this.$message.error(err);
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .operator{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    button{
      margin: 0 10px;
    }
  }
</style>