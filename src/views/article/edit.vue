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

      <el-form-item class="title" label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>

      <div class="el-form-item is-required item-editor" :class="{ 'is-error': validate.error }">
        <label class="el-form-item__label">文章内容</label>
        <div class="el-form-item__content">
          <div class="editor-wrapper">
            <div id="editor" ref="editor" :class="{'error-border': validate.error}">
              <el-input
                type="textarea"
                resize="none"
                :rows="20"
                placeholder="请输入markdown格式的文章正文"
                v-model="editorContent"
              ></el-input>
            </div>
            <div class="editor-preview markdown-body" ref="preview" v-html="getPreview"></div>
          </div>
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
  import 'github-markdown-css'
  import marked from 'marked'
  import {mapState} from 'vuex'

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
    },
    computed:{
      ...mapState(['user']),
      getPreview(){
        return marked(this.editorContent)
      }
    },
    methods: {
      getCategory(){
        const cq = new this.$api.SDK.Query('Category');
        cq.find().then((categories)=>{
          this.categories = categories
        }).catch(err=>console.log(err))
      },
      getArticle(){
        const id = this.$route.params.id;
        let q = new this.$api.SDK.Query('Article');
        q.include('category');
        q.get(id).then((article) => {
          this.article = article;
          this.form.title = article.get('title');
          this.form.category = article.get('category');
          this.editorContent = article.get('content')
          this.$Progress.finish()
        })
      },
      // 验证富文本内容
      validateContent(){
        if( this.editorContent.trim() === '' ){
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
        article.set('content', this.editorContent);
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
  .item-editor{ position: relative; z-index: 200; }
  #editor{ border: 1px solid transparent; }
  #editor.error-border{ border: 1px solid red; }
  .editor-wrapper{
    display: flex;
    > div{
      flex: 1;
      width: 50%;
    }
    .editor-preview{
      background: #f0f0f0;
      overflow: auto;
      height: 432px;
      border-radius: 3px;
      margin-left: 10px;
    }
  }
  .title{width: 30%;}
</style>