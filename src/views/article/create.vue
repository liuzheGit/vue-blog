<template>
  <div class="container">
    <h3 class="title is-3">发布一篇新的文章</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择文章分类">
          <el-option v-for="cate in categories" :key="cate.objectId" :label="cate.get('name')" :value="cate.get('name')">{{ cate.get('name') }}</el-option>
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
    data(){
      return {
        categories: [],
        editorContent: '',
        form: {
          category: '',
          title: '',
        },
        rules: {
          title: [
            { required: true, message: "必须填写标题哦!", trigger: 'blur' },
          ],
          category: [
            { type: 'string', required: true, message: "必须填写分类哦!", trigger: 'blur' },
          ],

        },

        validate: {
          error: false
        }
      }
    },
    created(){
      this.getCategories();
    },
    mounted(){
      this.initEditor();
    },
    methods: {
      initEditor(){
        let editor = new E(this.$refs.editor);
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        };
        editor.create();
      },
      getCategories(){
        const cq = new this.$api.SDK.Query('Category');
        cq.find().then((categories)=>{
          this.$Progress.finish();
          this.categories = categories;
          // this.form.category = categories[0].get('name')
        }).catch(error=>console.error(error))
      },
      // 验证富文本内容
      validateContent(){
        if(this.editorContent === ''
            || this.editorContent === '<p><br></p>'
            || this.editorContent === '<p>&nbsp;</p>'
            || this.editorContent === '<p>&nbsp;</p><p><br></p>'
        ){
          this.validate.error = true;
          return false
        }
        this.validate.error = false;
      },
      createArticle(){
        const article = new this.$api.SDK.Object('Article');
        article.set('author', this.user);
        article.set('title', this.form.title);
        article.set('content', this.editorContent);
        article.set('category', this.form.category)
        return article
      },
      save(article){
        article.save().then((article) => {
          const message = `文章《${article.get('title')}》发布成功`;
          this.$message({message, type: 'success'});
          this.$router.replace({name: 'ArticleShow', params: {id: article.id}})
        }).catch(error=>console.log(error))
      },
      submit(){
        this.$refs.form.validate((valid)=>{
          this.validateContent();
          if(valid){
            let article = this.createArticle();
            this.save(article)
          }else {
            this.$message.error('填写错误,请按照提示修改!');
            return false;
          }
        })
      }
    }
  }
</script>

<style scoped>
  #editor{
    border: 1px solid transparent;
  }
  #editor.error-border{
    border: 1px solid red;
  }
  .item-editor{
    position: relative;
    z-index: 200;
  }
</style>