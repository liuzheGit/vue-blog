<template>
  <div class="container">
    <h3 class="title is-3">发布一篇新的文章</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择文章分类">
          <el-option v-for="cate in categories" :key="cate.objectId" :label="cate.get('name')"
                     :value="cate.get('name')">{{ cate.get('name') }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>

      <div class="el-form-item is-required item-editor" :class="{ 'is-error': validate.error }">
        <label class="el-form-item__label">文章内容</label>
        <div class="el-form-item__content">
          <div id="editor" ref="editor" :class="{'error-border': validate.error}"></div>
          <div v-if="validate.error" class="el-form-item__error">正文怎能没有内容呢？</div>
        </div>
      </div>

      <div class="oprator right">
        <el-button class="submit" type="primary" @click="submit" @keyup.enter="submit">发布文章</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import E from 'wangeditor'

  let editor = null;

  export default {
    name: "create",
    data() {
      return {
        categories: [],
        editorContent: '',
        form: {
          category: '',
          title: '',
        },
        rules: {
          title: [
            {required: true, message: "必须填写标题哦!", trigger: 'blur'},
          ],
          category: [
            {type: 'string', required: true, message: "必须填写分类哦!", trigger: 'blur'},
          ],

        },

        validate: {
          error: false
        }
      }
    },
    computed: {
      ...mapState(['user'])
    },
    created() {
      this.getCategories();
    },
    mounted() {
      this.initEditor();
    },
    methods: {
      initEditor() {
        let editor = new E(this.$refs.editor);
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        };
        editor.create();
      },
      getCategories() {
        const cq = new this.$api.SDK.Query('Category');
        cq.find().then((categories) => {
          this.$Progress.finish();
          this.categories = categories;
          // this.form.category = categories[0].get('name')
        }).catch(error => console.error(error))
      },
      // 验证富文本内容
      validateContent() {
        if (this.editorContent === ''
            || this.editorContent === '<p><br></p>'
            || this.editorContent === '<p>&nbsp;</p>'
            || this.editorContent === '<p>&nbsp;</p><p><br></p>'
        ) {
          this.validate.error = true;
          return false
        }
        this.validate.error = false;
        return true
      },
      createArticle() {
        const article = new this.$api.SDK.Object('Article');
        article.set('author', this.user);
        article.set('title', this.form.title);
        article.set('content', this.editorContent);
        article.set('category', this.form.category);
        return article
      },

      setACL(article) {
        // 设置访问权限
        // https://leancloud.cn/docs/acl-guide.html#单用户权限设置
        let acl = new this.$api.SDK.ACL();
        acl.setPublicReadAccess(true);
        acl.setWriteAccess(this.user, true);
        article.setACL(acl);
      },
      save(article) {
        article.save().then((article) => {
          console.log('=====================')
          console.log(article)
          const message = `文章《${article.get('title')}》发布成功`;

          const status = new this.$api.SDK.Status();
          status.inboxType = 'friend';
          status.set('title', article.get('title'));
          status.set('type', 'create_article');
          status.set('article', article);

          // 发送朋友圈消息
          this.$api.SDK.Status.sendStatusToFollowers(status).then((status) => {
            console.log('发朋友圈成功')
          }).catch(err => console.log(err));


          this.$message({message, type: 'success'});
          this.$router.replace({name: 'ArticleShow', params: {id: article.id}})
        }).catch(error => console.log(error))
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (!this.validateContent()) {
            return
          }
          if (valid) {
            let article = this.createArticle();
            this.setACL(article)
            this.save(article)
          } else {
            this.$message.error('填写错误,请按照提示修改!');
            return false;
          }
        })
      }
    }
  }
</script>

<style scoped>
  #editor {
    border: 1px solid transparent;
  }

  #editor.error-border {
    border: 1px solid red;
  }

  .item-editor {
    position: relative;
    z-index: 200;
  }
</style>