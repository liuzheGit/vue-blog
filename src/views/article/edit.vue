<template>
  <div class="container">
    <h3 class="title is-3">编辑文章</h3>
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
      <el-button @click="cleanEditor">清空内容</el-button>
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
    name: "edit",
    data() {
      return {
        article: null,
        categories: [],
        editorContent: '',
        form: {
          category: '',
          title: ''
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
    created(){
      this.getCategory();
      this.getArticle()
    },
    mounted(){
      this.initEditor();
    },
    computed:{
      ...mapState(['user'])
    },
    methods: {
      initEditor(){
        editor = new E(this.$refs.editor);
        editor.customConfig.onchange = (html) => {
          this.editorContent = html
        };
        editor.create();
      },
      getCategory(){
        const cq = new this.$api.SDK.Query('Category');
        cq.find().then((categories)=>{
          this.categories = categories
        }).catch(err=>console.log(err))
      },
      cleanEditor(){
        editor.txt.clear()
      },
      getContent(){
        return editor.txt.html();
      },
      setContent(html){
        return editor.txt.html(html)
      },
      getArticle(){
        const id = this.$route.params.id;
        let q = new this.$api.SDK.Query('Article');
        q.include('category');
        q.get(id).then((article) => {
          this.article = article;

          this.form.title = article.get('title');
          this.form.category = article.get('category');

          this.wait(editor).then(() =>{
            this.setContent(article.get('content'))
          });

          this.$Progress.finish()
        })
      },
      wait(flag){
        console.log('这里是一个promise')
        return new Promise((resolve,reject)=>{
          let timer = null;
          if(flag){
            resolve()
          }else {
            timer = setInterval(()=>{
              if(!flag) {return;}
              resolve();
              clearInterval(timer)
            },500)
          }
        })
      },
      // 验证富文本内容
      validateContent(){
        let editorContent = this.getContent();
        if( editorContent === ''
            || editorContent === '<p><br></p>'
            || editorContent === '<p>&nbsp;</p>'
            || editorContent === '<p>&nbsp;</p><p><br></p>'
        ){
          this.validate.error = true;
          return false;
        }
        this.validate.error = false;
        return true;
      },
      setArticle(){
        const article = this.article;
        article.set('author', this.user);
        article.set('title', this.form.title);
        article.set('content', this.getContent());
        article.set('category', this.form.category);
        return article;
      },
      save(article){
        article.save().then((article)=>{
          const message = `文章《${article.get('title')}》修改成功`;
          this.$message({message, type: 'success'});
          this.$router.replace({name: 'ArticleShow', params: {id: article.id}})
        }).catch(err=>console.log(err))
      },
      submit(){
        this.$refs.form.validate((valid) =>{
          if(!this.validateContent()){return }
          if(valid){
            const article = this.setArticle();
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

<style scoped lang="scss">
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