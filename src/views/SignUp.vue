<template>
  <div class="container">
    <h1>注册</h1>
    <div class="form-panel">
      <el-form
        label-position="top"
        ref="form"
        label-width="80px"
        :rules="rules"
        :model="user">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" />
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="user.pwd" />
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input type="password" v-model="user.cpwd" />
        </el-form-item>

        <div class="operator">
          <el-button class="submit" type="primary" @click="submitForm('form')">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SignUp",
    data(){
      let validatePass = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入密码'))
        } else {
          if( this.user.cpwd !== ''){
            this.$refs.form.validateField('cpwd')
            callback();
          }
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请再次输入密码'));
        }else if(value !== this.user.pwd){
          callback(new Error('两次输入密码不一致'));
        }else {
          callback();
        }
      };
      return {
        labelPosition: 'top',
        user: {
          name: '',
          email: '',
          pwd: '',
          cpwd: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在3-20个字符之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请填入邮箱', trigger: 'blur'},
            {type: 'email', message: '必须是合法的邮箱格式'}
          ],
          pwd: [
            {required: true, message: '密码必须填写', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          cpwd: [
            { required: true, message: '必须填写', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            let user = new this.$api.SDK.User();
            user.setUsername(this.user.name);
            user.setPassword(this.user.pwd);
            user.setEmail(this.user.email);

            user.signUp().then((loginUser) =>{
              this.$store.commit('setUser', loginUser);
              this.$router.go(-1);
              this.$message.success('注册成功!')
            }).catch(error =>{
              console.error(error);
              this.$message.error(error.message);
            });
          }else {
            console.log('error submit!!');
            this.$message.error('填错了, 安装提示修改.');
            return false;
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>